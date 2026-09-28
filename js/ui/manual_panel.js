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
