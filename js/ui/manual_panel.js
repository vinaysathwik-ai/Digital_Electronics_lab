/**
 * SRM Digital Electronics Observation Book Panel
 * Displays Lab Manual Content: Aim, Apparatus, Theory, Pinouts, Schematics,
 * and Live Truth Table with active-row matching.
 */

class ManualPanel {
  constructor(containerEl, onExperimentChange) {
    this.container = containerEl;
    this.onExperimentChange = onExperimentChange;
    this.currentExp = null;
    this.completedExps = new Set();
    this.activeTab = 'manual'; // 'manual', 'truthtable', 'pinouts', 'checklist'
    this.loadProgress();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('srm_de_completed_exps');
      if (saved) {
        this.completedExps = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load progress from localStorage:', e);
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('srm_de_completed_exps', JSON.stringify([...this.completedExps]));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
  }

  markCompleted(expId) {
    this.completedExps.add(expId);
    this.saveProgress();
    this.render();
  }

  setExperiment(experiment) {
    this.currentExp = experiment;
    this.render();
  }

  render() {
    if (!this.currentExp) return;
    const exp = this.currentExp;
    const isCompleted = this.completedExps.has(exp.id);

    this.container.innerHTML = `
      <div class="manual-panel-inner">
        <!-- Manual Panel Header -->
        <div class="manual-header">
          <div class="manual-meta">
            <span class="manual-doc-tag">OBSERVATION BOOK</span>
            <div class="manual-header-actions">
              <span class="manual-course">ECE 211 / CSE 207</span>
              <button class="btn-close-sidebar" id="btn-close-sidebar" title="Hide Sidebar">&times;</button>
            </div>
          </div>
          <div class="exp-selector-wrap">
            <label for="exp-select-dropdown" class="selector-label">Select Experiment:</label>
            <select id="exp-select-dropdown" class="exp-dropdown">
              ${EXPERIMENTS.map(e => `
                <option value="${e.id}" ${e.id === exp.id ? 'selected' : ''}>
                  ${this.completedExps.has(e.id) ? '[Done] ' : ''}${e.title}
                </option>
              `).join('')}
            </select>
          </div>
          
          <!-- Navigation Tabs -->
          <div class="manual-tab-bar">
            <button class="manual-tab ${this.activeTab === 'manual' ? 'active' : ''}" data-tab="manual">
              Theory & Procedure
            </button>
            <button class="manual-tab ${this.activeTab === 'truthtable' ? 'active' : ''}" data-tab="truthtable">
              Live Truth Table
            </button>
            <button class="manual-tab ${this.activeTab === 'pinouts' ? 'active' : ''}" data-tab="pinouts">
              IC Pinouts
            </button>
            <button class="manual-tab ${this.activeTab === 'checklist' ? 'active' : ''}" data-tab="checklist">
              Progress (${this.completedExps.size}/${EXPERIMENTS.length})
            </button>
          </div>
        </div>

        <!-- Manual Content Body -->
        <div class="manual-body" id="manual-tab-content">
          ${this.renderTabContent()}
        </div>

        <!-- Manual Footer Quick Action Bar -->
        <div class="manual-footer-bar">
          <div class="completion-status-indicator ${isCompleted ? 'verified' : 'pending'}">
            <span class="status-icon">${isCompleted ? '✓' : '○'}</span>
            <span class="status-text">${isCompleted ? 'Verified by Instructor' : 'Not Yet Verified'}</span>
          </div>
          <div class="footer-btn-group">
            <button class="btn-ref-circuit" id="btn-load-reference" title="Auto-wires the reference circuit for learning">
              Load Reference Circuit
            </button>
            <button class="btn-verify-circuit" id="btn-verify-circuit" title="Ask Lab Instructor to verify circuit and test truth table">
              Verify Circuit
            </button>
          </div>
        </div>
      </div>
    `;

    // Close sidebar listener
    const btnCloseSidebar = this.container.querySelector('#btn-close-sidebar');
    if (btnCloseSidebar) {
      btnCloseSidebar.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.app && window.app.toggleSidebar) {
          window.app.toggleSidebar(false);
        }
      });
    }

    // Dropdown change
    const sel = this.container.querySelector('#exp-select-dropdown');
    sel.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const found = EXPERIMENTS.find(x => x.id === selectedId);
      if (found && this.onExperimentChange) {
        this.onExperimentChange(found);
      }
    });

    // Tab buttons
    this.container.querySelectorAll('.manual-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        this.activeTab = tabBtn.dataset.tab;
        this.render();
      });
    });

    // Action buttons
    const btnRef = this.container.querySelector('#btn-load-reference');
    btnRef.addEventListener('click', () => {
      if (typeof window !== 'undefined' && window.app && window.app.loadReferenceCircuit) {
        window.app.loadReferenceCircuit();
      }
    });

    const btnVerify = this.container.querySelector('#btn-verify-circuit');
    btnVerify.addEventListener('click', () => {
      if (typeof window !== 'undefined' && window.app && window.app.verifyCurrentExperiment) {
        window.app.verifyCurrentExperiment();
      }
    });

    // Checklist "Open Experiment" buttons
    this.container.querySelectorAll('.btn-check-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const expId = btn.dataset.expId;
        const exp = EXPERIMENTS.find(e => e.id === expId);
        if (exp && this.onExperimentChange) {
          this.onExperimentChange(exp);
        }
      });
    });
  }

  renderTabContent() {
    switch (this.activeTab) {
      case 'manual': return this.renderTheoryProcedureTab();
      case 'truthtable': return this.renderLiveTruthTableTab();
      case 'pinouts': return this.renderICPinoutsTab();
      case 'checklist': return this.renderChecklistTab();
      default: return this.renderTheoryProcedureTab();
    }
  }

  renderTheoryProcedureTab() {
    const exp = this.currentExp;
    return `
      <div class="manual-section-doc">
        <h3 class="exp-heading">${exp.title}</h3>

        <div class="doc-block aim-block">
          <h4>AIM:</h4>
          <p>${exp.aim}</p>
        </div>

        <div class="doc-block apparatus-block">
          <h4>APPARATUS REQUIRED:</h4>
          <table class="manual-spec-table">
            <thead>
              <tr>
                <th>SL No.</th>
                <th>Component / Equipment</th>
                <th>Specification / Part</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${exp.apparatus.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.spec || '-'}</td>
                  <td>${item.qty}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="doc-block theory-block">
          <h4>THEORY:</h4>
          <p style="white-space: pre-line;">${exp.theory}</p>
        </div>

        <div class="doc-block circuit-diag-block">
          <h4>CIRCUIT DIAGRAM:</h4>
          <div class="circuit-schematic-canvas">
            ${this.renderCircuitSVG(exp.id)}
          </div>
        </div>

        ${exp.functionGenerator ? `
        <div class="doc-block fg-block">
          <h4>⚡ FUNCTION GENERATOR SETTINGS (for CLK):</h4>
          <div class="fg-settings-card">
            <div class="fg-row"><span class="fg-label">Frequency:</span> <span class="fg-value">${exp.functionGenerator.frequency}</span></div>
            <div class="fg-row"><span class="fg-label">Amplitude:</span> <span class="fg-value">${exp.functionGenerator.amplitude}</span></div>
            <div class="fg-row"><span class="fg-label">DC Offset:</span> <span class="fg-value">${exp.functionGenerator.dcOffset}</span></div>
            <div class="fg-row"><span class="fg-label">Waveform:</span> <span class="fg-value">${exp.functionGenerator.waveform}</span></div>
            <div class="fg-row"><span class="fg-label">Fn.Gen (+) →</span> <span class="fg-value fg-clk">${exp.functionGenerator.positive}</span></div>
            <div class="fg-row"><span class="fg-label">Fn.Gen (−) →</span> <span class="fg-value fg-gnd">GND (Ground Rail)</span></div>
            <div class="alert-box alert-fg">In the simulator, use the <strong>PULSE</strong> button on the Function Generator panel to send a single clock pulse, or <strong>RUN</strong> to auto-clock continuously. Wire FG (+) to the CLK pin and FG (−) to GND.</div>
          </div>
        </div>
        ` : ''}

        <div class="doc-block procedure-block">
          <h4>PROCEDURE:</h4>
          <ol class="manual-proc-list">
            ${exp.procedure.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>

        <div class="doc-block rules-block">
          <h4>DO'S AND DON'TS (SRM LAB REGULATIONS):</h4>
          <div class="alert-box alert-warning">
            <strong>Rule 2 & 5:</strong> Make connections only when power switch is OFF. After completing all connections (especially +5V and GND), verify the circuit before operating switches.
          </div>
        </div>
      </div>
    `;
  }

  renderLiveTruthTableTab() {
    const exp = this.currentExp;
    const tt = exp.truthTable;

    // Detect if current board switch state matches any row
    let activeRowIdx = -1;
    let mapping = (typeof window !== 'undefined' && window.app && window.app.lastReport && window.app.lastReport.mapping)
      ? window.app.lastReport.mapping
      : null;

    if (!mapping && typeof window !== 'undefined' && window.app && window.app.engine && typeof TopologyVerifier !== 'undefined') {
      try {
        const topVerifier = new TopologyVerifier();
        const topRes = topVerifier.verify(exp, window.app.engine);
        if (topRes.passed) {
          mapping = topRes.mapping;
        }
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && window.app && window.app.engine) {
      const curSw = window.app.engine.switches;
      for (let r = 0; r < tt.rows.length; r++) {
        const row = tt.rows[r];
        let match = true;
        for (let i = 0; i < exp.inputs.length; i++) {
          const swIdx = (mapping && mapping.inputSwitches && mapping.inputSwitches[i] !== undefined)
            ? mapping.inputSwitches[i]
            : exp.inputs[i].switchIndex;
          if (curSw[swIdx] !== row.inputs[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          activeRowIdx = r;
          break;
        }
      }
    }

    // Get current actual LED states
    let actualLeds = [];
    if (typeof window !== 'undefined' && window.app && window.app.engine) {
      const sim = window.app.engine.simulate();
      actualLeds = exp.outputs.map((out, idx) => {
        const ledIdx = (mapping && mapping.outputLeds && mapping.outputLeds[idx] !== undefined)
          ? mapping.outputLeds[idx]
          : out.ledIndex;
        return sim.ledOutputs[ledIdx];
      });
    }

    return `
      <div class="manual-section-doc">
        <div class="tt-header-row">
          <h3>Live Truth Table Verification</h3>
          <span class="live-pill">REAL-TIME MONITORING</span>
        </div>
        <p class="tt-desc">
          Toggle the DIP switches on the trainer kit. The active row corresponding to your current input combination will highlight in gold.
        </p>

        <div class="truth-table-scroll">
          <table class="trainer-truth-table">
            <thead>
              <tr>
                <th>#</th>
                ${tt.headers.map(h => `<th>${h}</th>`).join('')}
                <th>Current Board State</th>
              </tr>
            </thead>
            <tbody>
              ${tt.rows.map((row, rIdx) => {
                const isActive = (rIdx === activeRowIdx);
                let rowPass = null;
                if (isActive && actualLeds.length === row.outputs.length) {
                  rowPass = actualLeds.every((v, i) => v === row.outputs[i]);
                }

                return `
                  <tr class="${isActive ? 'active-test-row' : ''}">
                    <td class="row-num">${rIdx + 1}</td>
                    ${row.inputs.map(val => `<td class="val-cell in-val">${val}</td>`).join('')}
                    ${row.outputs.map(val => `<td class="val-cell out-val">${val}</td>`).join('')}
                    <td class="status-cell">
                      ${isActive ? `
                        <span class="live-match-badge ${rowPass ? 'match-ok' : 'match-fail'}">
                          ${rowPass ? 'Match (' + actualLeds.join(', ') + ')' : 'Mismatch (' + actualLeds.join(', ') + ')'}
                        </span>
                      ` : '<span class="inactive-text">—</span>'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderICPinoutsTab() {
    const exp = this.currentExp;
    return `
      <div class="manual-section-doc">
        <h3>IC Pin Diagrams (Appendix-I Reference)</h3>
        <p>The following integrated circuits are utilized in this experiment. Cross-reference pin functions to properly route patch cords:</p>
        <div class="ic-pinout-grid">
          ${exp.requiredICs.map(partNo => {
            const def = IC_DEFINITIONS[partNo];
            if (!def) return '';
            return `
              <div class="ic-pinout-card">
                <div class="ic-card-header">
                  <strong>${def.partNumber}</strong>
                  <span>${def.name}</span>
                </div>
                <div class="ic-graphic-wrap">
                  ${this.renderICPinoutGraphic(def)}
                </div>
                <div class="ic-pins-list">
                  <div class="pins-col">
                    <strong>Pins 1 to ${def.pinCount / 2}:</strong>
                    <ul>
                      ${Array.from({ length: def.pinCount / 2 }, (_, i) => i + 1).map(p => `
                        <li><span class="p-num">Pin ${p}:</span> <span class="p-name">${def.pins[p].name}</span> (${def.pins[p].role || def.pins[p].type})</li>
                      `).join('')}
                    </ul>
                  </div>
                  <div class="pins-col">
                    <strong>Pins ${def.pinCount / 2 + 1} to ${def.pinCount}:</strong>
                    <ul>
                      ${Array.from({ length: def.pinCount / 2 }, (_, i) => def.pinCount - i).map(p => `
                        <li><span class="p-num">Pin ${p}:</span> <span class="p-name">${def.pins[p].name}</span> (${def.pins[p].role || def.pins[p].type})</li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderChecklistTab() {
    return `
      <div class="manual-section-doc">
        <h3>SRM Lab Syllabus Completion Checklist</h3>
        <p>Complete all required experiments and verify them with the virtual Lab Instructor to earn full marks in the observation record.</p>

        <div class="checklist-grid">
          ${EXPERIMENTS.map((e, idx) => {
            const done = this.completedExps.has(e.id);
            return `
              <div class="checklist-card ${done ? 'done' : 'pending'}">
                <div class="check-status-badge">${done ? 'VERIFIED' : 'PENDING'}</div>
                <div class="check-card-body">
                  <h4>${e.title}</h4>
                  <p class="check-aim">${e.aim}</p>
                  <div class="check-chips">
                    <span class="chip">Exp ${e.expNum}</span>
                    <span class="chip">ICs: ${e.requiredICs.join(', ')}</span>
                  </div>
                </div>
                <button class="btn-check-select" data-exp-id="${e.id}">
                  ${e.id === this.currentExp.id ? 'Current Experiment' : 'Open Experiment'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderCircuitSVG(expId) {
    // Generate clean SVG schematics for the current experiment
    switch (expId) {
      case 'exp1_and':
        return `
          <svg viewBox="0 0 400 150" class="schematic-svg">
            <text x="30" y="45" fill="#e0e0e0" font-size="12">A (Pin 1)</text>
            <line x1="90" y1="40" x2="160" y2="40" stroke="#ffd54f" stroke-width="2.5" />
            <text x="30" y="95" fill="#e0e0e0" font-size="12">B (Pin 2)</text>
            <line x1="90" y1="90" x2="160" y2="90" stroke="#ffd54f" stroke-width="2.5" />
            <!-- AND Gate Body -->
            <path d="M 160 20 L 200 20 A 45 45 0 0 1 200 110 L 160 110 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" />
            <text x="180" y="70" fill="#38bdf8" font-size="14" font-weight="bold">AND</text>
            <!-- Output -->
            <line x1="245" y1="65" x2="310" y2="65" stroke="#4ade80" stroke-width="2.5" />
            <text x="315" y="70" fill="#4ade80" font-size="12">Y (Pin 3) -> LED 0</text>
          </svg>
        `;
      case 'exp1_or':
        return `
          <svg viewBox="0 0 400 150" class="schematic-svg">
            <text x="30" y="45" fill="#e0e0e0" font-size="12">A (Pin 1)</text>
            <line x1="90" y1="40" x2="160" y2="40" stroke="#ffd54f" stroke-width="2.5" />
            <text x="30" y="95" fill="#e0e0e0" font-size="12">B (Pin 2)</text>
            <line x1="90" y1="90" x2="160" y2="90" stroke="#ffd54f" stroke-width="2.5" />
            <!-- OR Gate Body -->
            <path d="M 150 20 Q 185 65 150 110 Q 210 110 245 65 Q 210 20 150 20 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" />
            <text x="185" y="70" fill="#38bdf8" font-size="14" font-weight="bold">OR</text>
            <line x1="245" y1="65" x2="310" y2="65" stroke="#4ade80" stroke-width="2.5" />
            <text x="315" y="70" fill="#4ade80" font-size="12">Y (Pin 3) -> LED 0</text>
          </svg>
        `;
      case 'exp2_bin2gray':
        return `
          <svg viewBox="0 0 500 200" class="schematic-svg">
            <!-- B3 directly to G3 -->
            <text x="20" y="35" fill="#ffd54f" font-size="12">B3</text>
            <line x1="50" y1="30" x2="420" y2="30" stroke="#ffd54f" stroke-width="2.5" />
            <text x="430" y="35" fill="#4ade80" font-size="12">G3</text>
            <!-- Gate 1: B3 ^ B2 -> G2 -->
            <line x1="120" y1="30" x2="120" y2="70" stroke="#ffd54f" stroke-width="2" />
            <line x1="120" y1="70" x2="170" y2="70" stroke="#ffd54f" stroke-width="2" />
            <text x="20" y="95" fill="#ffd54f" font-size="12">B2</text>
            <line x1="50" y1="90" x2="170" y2="90" stroke="#ffd54f" stroke-width="2" />
            <rect x="170" y="60" width="60" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
            <text x="185" y="85" fill="#38bdf8" font-size="12">XOR 1</text>
            <line x1="230" y1="80" x2="420" y2="80" stroke="#4ade80" stroke-width="2.5" />
            <text x="430" y="85" fill="#4ade80" font-size="12">G2</text>
            <!-- Gate 2: B2 ^ B1 -> G1 -->
            <text x="20" y="145" fill="#ffd54f" font-size="12">B1</text>
            <line x1="50" y1="140" x2="250" y2="140" stroke="#ffd54f" stroke-width="2" />
            <rect x="250" y="115" width="60" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
            <text x="265" y="140" fill="#38bdf8" font-size="12">XOR 2</text>
            <line x1="310" y1="135" x2="420" y2="135" stroke="#4ade80" stroke-width="2.5" />
            <text x="430" y="140" fill="#4ade80" font-size="12">G1</text>
            <!-- Gate 3: B1 ^ B0 -> G0 -->
            <text x="20" y="185" fill="#ffd54f" font-size="12">B0</text>
            <line x1="50" y1="180" x2="330" y2="180" stroke="#ffd54f" stroke-width="2" />
            <rect x="330" y="155" width="60" height="35" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
            <text x="345" y="177" fill="#38bdf8" font-size="12">XOR 3</text>
            <line x1="390" y1="172" x2="420" y2="172" stroke="#4ade80" stroke-width="2.5" />
            <text x="430" y="177" fill="#4ade80" font-size="12">G0</text>
          </svg>
        `;
      case 'exp3_half_adder':
        return `
          <svg viewBox="0 0 450 160" class="schematic-svg">
            <text x="20" y="45" fill="#ffd54f" font-size="12">A (SW 0)</text>
            <line x1="80" y1="40" x2="160" y2="40" stroke="#ffd54f" stroke-width="2.5" />
            <text x="20" y="105" fill="#ffd54f" font-size="12">B (SW 1)</text>
            <line x1="80" y1="100" x2="160" y2="100" stroke="#ffd54f" stroke-width="2.5" />
            <!-- XOR gate -->
            <rect x="160" y="25" width="80" height="45" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2" />
            <text x="175" y="52" fill="#a855f7" font-size="12" font-weight="bold">7486 (XOR)</text>
            <line x1="240" y1="47" x2="330" y2="47" stroke="#4ade80" stroke-width="2.5" />
            <text x="340" y="52" fill="#4ade80" font-size="12">SUM (S)</text>
            <!-- AND gate -->
            <rect x="160" y="90" width="80" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
            <text x="175" y="117" fill="#38bdf8" font-size="12" font-weight="bold">7408 (AND)</text>
            <line x1="240" y1="112" x2="330" y2="112" stroke="#fb923c" stroke-width="2.5" />
            <text x="340" y="117" fill="#fb923c" font-size="12">CARRY (C)</text>
          </svg>
        `;
      case 'exp6_comparator':
      case 'exp6_magnitude_comparator':
        return `
          <svg viewBox="0 0 540 180" class="schematic-svg">
            <text x="20" y="30" fill="#ffd54f" font-size="10">A3..A0 (SW3..0)</text>
            <line x1="110" y1="25" x2="180" y2="25" stroke="#ffd54f" stroke-width="2"/>
            <text x="20" y="55" fill="#4ade80" font-size="10">B3..B0 (SW7..4)</text>
            <line x1="110" y1="50" x2="180" y2="50" stroke="#4ade80" stroke-width="2"/>
            <text x="20" y="80" fill="#888" font-size="9">Cascading Inputs:</text>
            <text x="20" y="95" fill="#888" font-size="9">A=B_in(P3)→VCC</text>
            <text x="20" y="110" fill="#888" font-size="9">A&gt;B_in(P4), A&lt;B_in(P2)→GND</text>
            <rect x="180" y="15" width="160" height="130" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="210" y="50" fill="#38bdf8" font-size="13" font-weight="bold">IC 7485</text>
            <text x="195" y="70" fill="#888" font-size="10">4-Bit Comparator</text>
            <text x="195" y="90" fill="#888" font-size="8">VCC=Pin16, GND=Pin8</text>
            <!-- Outputs -->
            <line x1="340" y1="45" x2="420" y2="45" stroke="#4ade80" stroke-width="2.5"/>
            <text x="425" y="49" fill="#4ade80" font-size="10">A&gt;B (Pin 5) → LED 0</text>
            <line x1="340" y1="75" x2="420" y2="75" stroke="#38bdf8" stroke-width="2.5"/>
            <text x="425" y="79" fill="#38bdf8" font-size="10">A=B (Pin 6) → LED 1</text>
            <line x1="340" y1="105" x2="420" y2="105" stroke="#f06292" stroke-width="2.5"/>
            <text x="425" y="109" fill="#f06292" font-size="10">A&lt;B (Pin 7) → LED 2</text>
            <text x="180" y="165" fill="#888" font-size="9">Compares 4-bit unsigned A vs B</text>
          </svg>
        `;
      case 'exp7_rs_ff':
        return `
          <svg viewBox="0 0 500 180" class="schematic-svg">
            <text x="20" y="30" fill="#e0e0e0" font-size="11">S' (SW0)</text>
            <line x1="80" y1="25" x2="150" y2="25" stroke="#ffd54f" stroke-width="2"/>
            <rect x="150" y="10" width="90" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="168" y="35" fill="#38bdf8" font-size="12" font-weight="bold">NAND G1</text>
            <line x1="240" y1="30" x2="320" y2="30" stroke="#4ade80" stroke-width="2.5"/>
            <text x="325" y="34" fill="#4ade80" font-size="11">Q → LED0</text>
            <text x="20" y="80" fill="#e0e0e0" font-size="11">R' (SW1)</text>
            <line x1="80" y1="75" x2="150" y2="75" stroke="#fb923c" stroke-width="2"/>
            <rect x="150" y="60" width="90" height="40" rx="5" fill="#1e293b" stroke="#f06292" stroke-width="2"/>
            <text x="168" y="85" fill="#f06292" font-size="12" font-weight="bold">NAND G2</text>
            <line x1="240" y1="80" x2="320" y2="80" stroke="#fb923c" stroke-width="2.5"/>
            <text x="325" y="84" fill="#fb923c" font-size="11">Q' → LED1</text>
            <!-- Cross-couple arrows -->
            <path d="M 320 30 L 360 30 L 360 110 L 150 110 L 150 90" stroke="#ab47bc" stroke-width="1.5" fill="none" stroke-dasharray="4,3"/>
            <path d="M 320 80 L 350 80 L 350 130 L 150 130 L 150 40" stroke="#00acc1" stroke-width="1.5" fill="none" stroke-dasharray="4,3"/>
            <text x="150" y="155" fill="#888" font-size="10">Cross-coupled NAND latch (SR Flip-Flop)</text>
          </svg>
        `;
      case 'exp7_d_ff':
        return `
          <svg viewBox="0 0 500 150" class="schematic-svg">
            <text x="20" y="45" fill="#ff7043" font-size="11">CLK → Pin 3 (SW0 / Fn.Gen)</text>
            <line x1="150" y1="40" x2="200" y2="40" stroke="#ff7043" stroke-width="2.5"/>
            <text x="20" y="80" fill="#ffd54f" font-size="11">D → Pin 2 (SW1)</text>
            <line x1="150" y1="75" x2="200" y2="75" stroke="#ffd54f" stroke-width="2.5"/>
            <rect x="200" y="20" width="110" height="80" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="225" y="58" fill="#38bdf8" font-size="13" font-weight="bold">D FF (7474)</text>
            <text x="208" y="38" fill="#ff7043" font-size="9">CLK</text>
            <text x="208" y="72" fill="#ffd54f" font-size="9">D</text>
            <line x1="310" y1="45" x2="390" y2="45" stroke="#4ade80" stroke-width="2.5"/>
            <text x="395" y="50" fill="#4ade80" font-size="11">Q → LED0</text>
            <line x1="310" y1="75" x2="390" y2="75" stroke="#ab47bc" stroke-width="2.5"/>
            <text x="395" y="80" fill="#ab47bc" font-size="11">Q' → LED1</text>
            <text x="150" y="130" fill="#888" font-size="10">PRE (Pin4) and CLR (Pin1) both tied to Vcc (inactive)</text>
          </svg>
        `;
      case 'exp7_jk_ff':
      case 'exp7_t_ff':
        return `
          <svg viewBox="0 0 500 170" class="schematic-svg">
            <text x="20" y="40" fill="#ff7043" font-size="11">CLK → Pin1 (SW0 / Fn.Gen)</text>
            <line x1="150" y1="35" x2="200" y2="35" stroke="#ff7043" stroke-width="2.5"/>
            <text x="20" y="75" fill="#ffd54f" font-size="11">J → Pin4 (SW1)</text>
            <line x1="150" y1="70" x2="200" y2="70" stroke="#ffd54f" stroke-width="2.5"/>
            <text x="20" y="110" fill="#43a047" font-size="11">K → Pin8 (SW2${this.currentExp && this.currentExp.id === 'exp7_t_ff' ? ' → Vcc)' : ')'}</text>
            <line x1="150" y1="105" x2="200" y2="105" stroke="#43a047" stroke-width="2.5"/>
            <rect x="200" y="15" width="115" height="105" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="222" y="68" fill="#38bdf8" font-size="13" font-weight="bold">JK FF (7476)</text>
            <line x1="315" y1="45" x2="390" y2="45" stroke="#4ade80" stroke-width="2.5"/>
            <text x="395" y="50" fill="#4ade80" font-size="11">Q → LED0</text>
            <line x1="315" y1="85" x2="390" y2="85" stroke="#ab47bc" stroke-width="2.5"/>
            <text x="395" y="90" fill="#ab47bc" font-size="11">Q' → LED1</text>
            <text x="130" y="150" fill="#888" font-size="10">VCC=Pin5, GND=Pin13. PRE(Pin2) and CLR(Pin3) tied to Vcc.</text>
          </svg>
        `;
      case 'exp8_ring_counter':
        return `
          <svg viewBox="0 0 540 160" class="schematic-svg">
            <text x="10" y="25" fill="#ff7043" font-size="10">CLK (SW0)</text>
            <line x1="55" y1="20" x2="80" y2="20" stroke="#ff7043" stroke-width="2"/>
            <line x1="55" y1="20" x2="55" y2="140" stroke="#ff7043" stroke-width="1.5" stroke-dasharray="4,3"/>
            <rect x="80"  y="10" width="80" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="92"  y="35" fill="#38bdf8" font-size="11">D-FF0</text>
            <rect x="210" y="10" width="80" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="222" y="35" fill="#38bdf8" font-size="11">D-FF1</text>
            <rect x="340" y="10" width="80" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="352" y="35" fill="#38bdf8" font-size="11">D-FF2</text>
            <!-- Q connections -->
            <line x1="160" y1="30" x2="210" y2="30" stroke="#4ade80" stroke-width="2"/>
            <line x1="290" y1="30" x2="340" y2="30" stroke="#4ade80" stroke-width="2"/>
            <!-- Output LEDs -->
            <line x1="160" y1="30" x2="160" y2="80" stroke="#4ade80" stroke-width="1.5"/>
            <text x="150" y="95" fill="#4ade80" font-size="10">LED0</text>
            <line x1="290" y1="30" x2="290" y2="80" stroke="#4ade80" stroke-width="1.5"/>
            <text x="280" y="95" fill="#4ade80" font-size="10">LED1</text>
            <line x1="420" y1="30" x2="420" y2="80" stroke="#4ade80" stroke-width="1.5"/>
            <text x="410" y="95" fill="#4ade80" font-size="10">LED2</text>
            <!-- Ring feedback arrow -->
            <path d="M 420 30 L 470 30 L 470 130 L 60 130 L 60 30 L 80 30" stroke="#f06292" stroke-width="2" fill="none" marker-end="url(#arrow)"/>
            <text x="210" y="145" fill="#f06292" font-size="10">Ring feedback: Q2 → D0</text>
          </svg>
        `;
      case 'exp8_johnson_counter':
        return `
          <svg viewBox="0 0 540 170" class="schematic-svg">
            <text x="10" y="25" fill="#ff7043" font-size="10">CLK</text>
            <line x1="55" y1="20" x2="80" y2="20" stroke="#ff7043" stroke-width="2"/>
            <rect x="80"  y="10" width="80" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="92"  y="35" fill="#38bdf8" font-size="11">D-FF0</text>
            <rect x="210" y="10" width="80" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="222" y="35" fill="#38bdf8" font-size="11">D-FF1</text>
            <rect x="340" y="10" width="80" height="40" rx="5" fill="#1e293b" stroke="#f06292" stroke-width="2"/>
            <text x="352" y="35" fill="#f06292" font-size="11">D-FF2</text>
            <line x1="160" y1="30" x2="210" y2="30" stroke="#4ade80" stroke-width="2"/>
            <line x1="290" y1="30" x2="340" y2="30" stroke="#4ade80" stroke-width="2"/>
            <line x1="160" y1="30" x2="160" y2="80" stroke="#4ade80" stroke-width="1.5"/>
            <text x="150" y="95" fill="#4ade80" font-size="10">LED0</text>
            <line x1="290" y1="30" x2="290" y2="80" stroke="#4ade80" stroke-width="1.5"/>
            <text x="280" y="95" fill="#4ade80" font-size="10">LED1</text>
            <line x1="420" y1="30" x2="420" y2="80" stroke="#f06292" stroke-width="1.5"/>
            <text x="406" y="95" fill="#f06292" font-size="10">Q2' (inv)</text>
            <!-- Johnson twist: Q' feeds back -->
            <text x="340" y="58" fill="#f06292" font-size="8">Q2'=Pin6</text>
            <path d="M 420 50 L 470 50 L 470 140 L 60 140 L 60 30 L 80 30" stroke="#f06292" stroke-width="2" fill="none" stroke-dasharray="5,3"/>
            <text x="170" y="158" fill="#f06292" font-size="10">TWIST: Q2' (complement) → D0 (Johnson counter)</text>
          </svg>
        `;
      case 'exp9_sync_counter':
        return `
          <svg viewBox="0 0 540 170" class="schematic-svg">
            <text x="10" y="20" fill="#ff7043" font-size="10">CLK (1Hz)</text>
            <line x1="60" y1="15" x2="60" y2="150" stroke="#ff7043" stroke-width="1.5" stroke-dasharray="3,3"/>
            <rect x="80"  y="10" width="85" height="45" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="92"  y="27" fill="#38bdf8" font-size="10">JK-FF A</text>
            <text x="92"  y="42" fill="#888" font-size="9">J=K=Vcc</text>
            <rect x="220" y="10" width="85" height="45" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="232" y="27" fill="#38bdf8" font-size="10">JK-FF B</text>
            <text x="232" y="42" fill="#888" font-size="9">J=K=QA</text>
            <rect x="360" y="10" width="85" height="45" rx="5" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="372" y="27" fill="#38bdf8" font-size="10">JK-FF C</text>
            <text x="372" y="42" fill="#888" font-size="9">J=K=QA·QB</text>
            <!-- AND gate -->
            <rect x="260" y="90" width="60" height="30" rx="4" fill="#1e293b" stroke="#fbc02d" stroke-width="2"/>
            <text x="272" y="110" fill="#fbc02d" font-size="10">AND</text>
            <!-- QA→B, QA,QB→AND→C -->
            <line x1="165" y1="30" x2="220" y2="30" stroke="#4ade80" stroke-width="2"/>
            <line x1="165" y1="30" x2="165" y2="100" stroke="#4ade80" stroke-width="1.5"/>
            <line x1="165" y1="100" x2="260" y2="100" stroke="#4ade80" stroke-width="1.5"/>
            <line x1="305" y1="30" x2="360" y2="30" stroke="#29b6f6" stroke-width="2"/>
            <line x1="305" y1="30" x2="305" y2="115" stroke="#29b6f6" stroke-width="1.5"/>
            <line x1="305" y1="115" x2="320" y2="115" stroke="#29b6f6" stroke-width="1.5"/>
            <line x1="320" y1="115" x2="260" y2="115" stroke="#29b6f6" stroke-width="1.5"/>
            <line x1="320" y1="105" x2="360" y2="40" stroke="#ab47bc" stroke-width="1.5"/>
            <!-- Output LEDs -->
            <line x1="165" y1="30" x2="165" y2="150" stroke="#4ade80" stroke-width="1.5"/>
            <text x="155" y="162" fill="#4ade80" font-size="9">QA=LED0</text>
            <text x="285" y="162" fill="#29b6f6" font-size="9">QB=LED1</text>
            <text x="415" y="162" fill="#ffa726" font-size="9">QC=LED2</text>
          </svg>
        `;
      case 'exp10_decade_counter':
        return `
          <svg viewBox="0 0 500 160" class="schematic-svg">
            <text x="20" y="30" fill="#ff7043" font-size="11">CLK → CKA Pin14 (SW0 / Fn.Gen)</text>
            <line x1="200" y1="25" x2="240" y2="25" stroke="#ff7043" stroke-width="2.5"/>
            <rect x="240" y="10" width="140" height="110" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="285" y="40" fill="#38bdf8" font-size="13" font-weight="bold">IC 7490</text>
            <text x="250" y="58" fill="#888" font-size="9">CKA=Pin14 | CKB=Pin1</text>
            <text x="250" y="72" fill="#888" font-size="9">QA=12, QB=9, QC=8, QD=11</text>
            <text x="250" y="86" fill="#888" font-size="9">VCC=Pin5, GND=Pin10</text>
            <text x="250" y="100" fill="#888" font-size="9">QA→CKB (BCD connection)</text>
            <!-- Outputs -->
            <line x1="380" y1="55" x2="440" y2="55" stroke="#4ade80" stroke-width="2"/>
            <text x="445" y="59" fill="#4ade80" font-size="10">QA→LED0</text>
            <line x1="380" y1="75" x2="440" y2="75" stroke="#29b6f6" stroke-width="2"/>
            <text x="445" y="79" fill="#29b6f6" font-size="10">QB→LED1</text>
            <line x1="380" y1="93" x2="440" y2="93" stroke="#ab47bc" stroke-width="2"/>
            <text x="445" y="97" fill="#ab47bc" font-size="10">QC→LED2</text>
            <line x1="380" y1="111" x2="440" y2="111" stroke="#ffa726" stroke-width="2"/>
            <text x="445" y="115" fill="#ffa726" font-size="10">QD→LED3</text>
            <text x="20" y="145" fill="#888" font-size="10">Fn.Gen: 1Hz, 5Vp-p, DC Offset=2V, Square. R0 and R9 → GND.</text>
          </svg>
        `;
      case 'exp11_sipo':
        return `
          <svg viewBox="0 0 500 160" class="schematic-svg">
            <text x="20" y="25" fill="#ff7043" font-size="10">CLK1 → Pin8 (SW0)</text>
            <line x1="130" y1="20" x2="180" y2="20" stroke="#ff7043" stroke-width="2"/>
            <text x="20" y="50" fill="#ffd54f" font-size="10">SER → Pin1 (SW1)</text>
            <line x1="130" y1="45" x2="180" y2="45" stroke="#ffd54f" stroke-width="2"/>
            <text x="20" y="75" fill="#888" font-size="10">MODE=0 → GND (Serial)</text>
            <line x1="130" y1="70" x2="180" y2="70" stroke="#888" stroke-width="1.5"/>
            <rect x="180" y="10" width="120" height="100" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="210" y="55" fill="#38bdf8" font-size="13" font-weight="bold">IC 7495</text>
            <text x="195" y="72" fill="#888" font-size="8">SIPO Mode (Mode=0)</text>
            <line x1="300" y1="30" x2="370" y2="30" stroke="#4ade80" stroke-width="2"/>
            <text x="375" y="34" fill="#4ade80" font-size="10">QA→LED0</text>
            <line x1="300" y1="50" x2="370" y2="50" stroke="#29b6f6" stroke-width="2"/>
            <text x="375" y="54" fill="#29b6f6" font-size="10">QB→LED1</text>
            <line x1="300" y1="70" x2="370" y2="70" stroke="#ab47bc" stroke-width="2"/>
            <text x="375" y="74" fill="#ab47bc" font-size="10">QC→LED2</text>
            <line x1="300" y1="90" x2="370" y2="90" stroke="#ffa726" stroke-width="2"/>
            <text x="375" y="94" fill="#ffa726" font-size="10">QD→LED3</text>
            <text x="20" y="140" fill="#888" font-size="9">Serial data shifts right on each CLK1 pulse. After 4 pulses, all bits visible at QA-QD.</text>
          </svg>
        `;
      case 'exp11_piso':
      case 'exp11_pipo':
        return `
          <svg viewBox="0 0 500 160" class="schematic-svg">
            <text x="20" y="20" fill="#ff7043" font-size="10">CLK(SW0)→Pin${this.currentExp && this.currentExp.id === 'exp11_pipo' ? '9(CLK2)' : '8/9'}</text>
            <text x="20" y="38" fill="#ffd54f" font-size="10">MODE(SW1)→Pin6 (1=Parallel)</text>
            <text x="20" y="55" fill="#43a047" font-size="10">A(SW2)→P2, B(SW3)→P3, C(SW4)→P4, D(SW5)→P5</text>
            <line x1="175" y1="20" x2="210" y2="20" stroke="#ff7043" stroke-width="2"/>
            <line x1="175" y1="38" x2="210" y2="38" stroke="#ffd54f" stroke-width="2"/>
            <line x1="175" y1="55" x2="210" y2="55" stroke="#43a047" stroke-width="2"/>
            <rect x="210" y="10" width="120" height="100" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="235" y="55" fill="#38bdf8" font-size="13" font-weight="bold">IC 7495</text>
            <text x="215" y="72" fill="#888" font-size="8">${this.currentExp && this.currentExp.id === 'exp11_pipo' ? 'PIPO Mode (Mode=1)' : 'PISO Mode'}</text>
            <line x1="330" y1="30" x2="400" y2="30" stroke="#4ade80" stroke-width="2"/>
            <text x="405" y="34" fill="#4ade80" font-size="10">QA→LED0</text>
            <line x1="330" y1="50" x2="400" y2="50" stroke="#29b6f6" stroke-width="2"/>
            <text x="405" y="54" fill="#29b6f6" font-size="10">QB→LED1</text>
            <line x1="330" y1="70" x2="400" y2="70" stroke="#ab47bc" stroke-width="2"/>
            <text x="405" y="74" fill="#ab47bc" font-size="10">QC→LED2</text>
            <line x1="330" y1="90" x2="400" y2="90" stroke="#ffa726" stroke-width="2"/>
            <text x="405" y="94" fill="#ffa726" font-size="10">QD→LED3</text>
          </svg>
        `;
      default:
        return `
          <div class="schematic-placeholder">
            <p>Wiring Schematic configured per SRM Laboratory Observation Book Specifications.</p>
            <p>Refer to IC Pinouts tab or click <strong>Load Reference Circuit</strong> to see the exact patch cord connections.</p>
          </div>
        `;
    }
  }

  renderICPinoutGraphic(def) {
    const pinCount = def.pinCount;
    const half = pinCount / 2;
    return `
      <div class="dip-ic-diagram-svg">
        <svg viewBox="0 0 240 120" style="width: 100%; max-width: 260px;">
          <!-- DIP Chip Body -->
          <rect x="30" y="25" width="180" height="70" rx="4" fill="#1c1917" stroke="#57534e" stroke-width="2" />
          <path d="M 30 50 A 10 10 0 0 1 30 70 Z" fill="#0c0a09" />
          <circle cx="45" cy="80" r="3" fill="#a8a29e" />
          <text x="120" y="60" text-anchor="middle" fill="#e7e5e4" font-size="12" font-weight="bold">${def.partNumber}</text>
          <text x="120" y="75" text-anchor="middle" fill="#a8a29e" font-size="8">${pinCount}-PIN DIP</text>

          <!-- Top Pins -->
          ${Array.from({ length: half }, (_, i) => {
            const pinNum = pinCount - i;
            const x = 50 + i * (140 / (half - 1));
            return `
              <line x1="${x}" y1="10" x2="${x}" y2="25" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" />
              <text x="${x}" y="8" text-anchor="middle" fill="#94a3b8" font-size="7">${pinNum}</text>
            `;
          }).join('')}

          <!-- Bottom Pins -->
          ${Array.from({ length: half }, (_, i) => {
            const pinNum = i + 1;
            const x = 50 + i * (140 / (half - 1));
            return `
              <line x1="${x}" y1="95" x2="${x}" y2="110" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" />
              <text x="${x}" y="118" text-anchor="middle" fill="#94a3b8" font-size="7">${pinNum}</text>
            `;
          }).join('')}
        </svg>
      </div>
    `;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ManualPanel };
}
