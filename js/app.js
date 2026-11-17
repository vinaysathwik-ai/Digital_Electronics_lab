/**
 * Main Application Orchestrator
 * Coordinates trainer engine, UI views, IC picker,
 * verification modals, sidebar drawer toggle, and experiment state.
 */

class TrainerApp {
  constructor() {
    this.engine = new NetlistEngine();
    this.currentExp = EXPERIMENTS[0];
    this.targetSocketForPicker = null;
    this.lastReport = null;

    this.initDOM();
    this.loadExperiment(this.currentExp);
  }

  initDOM() {
    const boardContainer = document.getElementById('trainer-board-container');
    const manualContainer = document.getElementById('manual-panel-container');

    // Create WireManager with temporary null svg
    this.wireManager = new WireManager(this.engine, null);

    // Create BoardView which renders the board and the <svg id="wire-svg">
    this.boardView = new BoardView(this.engine, boardContainer, this.wireManager);

    // Now bind the created SVG element into WireManager
    const svgOverlay = document.getElementById('wire-svg');
    this.wireManager.svg = svgOverlay;

    this.manualPanel = new ManualPanel(manualContainer, (newExp) => {
      this.loadExperiment(newExp);
    });

    this.verifier = new LabVerifier(this.engine);

    // Track wire selection state on remove button
    this.wireManager.onSelectionChange = (wireId) => {
      const btnRemove = document.getElementById('btn-remove-wire');
      if (btnRemove) {
        btnRemove.classList.toggle('has-selection', !!wireId);
      }
    };

    // Bind engine change events
    this.engine.onChange(() => {
      this.handleCircuitStateChange();
    });

    // Window resize, orientation change & board viewport scroll handler for wire rendering
    window.addEventListener('resize', () => {
      this.wireManager.render();
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.wireManager.render();
      }, 250);
    });
    if (boardContainer) {
      boardContainer.addEventListener('scroll', () => {
        this.wireManager.render();
      }, { passive: true });
    }

    this.setupToolbarEvents();
    this.setupModalEvents();
    this.setupSidebarToggle();

    // Set initial active state of sidebar toggle button based on body class
    const btnNav = document.getElementById('btn-toggle-manual');
    if (btnNav) {
      btnNav.classList.toggle('active', !document.body.classList.contains('sidebar-collapsed'));
    }
  }

  showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  toggleSidebar(forceState) {
    const body = document.body;
    if (typeof forceState === 'boolean') {
      if (forceState) {
        body.classList.remove('sidebar-collapsed');
      } else {
        body.classList.add('sidebar-collapsed');
      }
    } else {
      body.classList.toggle('sidebar-collapsed');
    }

    const btnNav = document.getElementById('btn-toggle-manual');
    const isCollapsed = body.classList.contains('sidebar-collapsed');
    if (btnNav) {
      btnNav.classList.toggle('active', !isCollapsed);
    }

    // Re-render wires after transition
    setTimeout(() => {
      this.wireManager.render();
    }, 260);
  }

  setupSidebarToggle() {
    const btnNav = document.getElementById('btn-toggle-manual');
    if (btnNav) {
      btnNav.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    const floatingTab = document.getElementById('floating-sidebar-tab');
    if (floatingTab) {
      floatingTab.addEventListener('click', () => {
        this.toggleSidebar(true);
      });
    }

    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.toggleSidebar(false);
      });
    }
  }

  loadExperiment(exp) {
    this.currentExp = exp;
    this.lastReport = null;
    this.wireManager.setSelectedWire(null);
    this.engine.clearWires();

    // Reset sockets & auto-insert default ICs for this experiment
    for (let s = 0; s < this.engine.sockets.length; s++) {
      this.engine.removeIC(s);
    }

    if (exp.defaultSockets) {
      for (const ds of exp.defaultSockets) {
        this.engine.installIC(ds.socketId, ds.partNumber);
      }
    }

    this.boardView.stopClockAutoRun();
    this.boardView.renderSockets();
    this.boardView.updateFuncGenExperiment(exp);
    this.manualPanel.setExperiment(exp);
    this.handleCircuitStateChange();
    this.showToast(`Loaded ${exp.title}`);
  }

  loadReferenceCircuit() {
    if (!this.currentExp) return;
    this.wireManager.setSelectedWire(null);
    this.engine.clearWires();

    // Ensure sockets have the required ICs
    for (const ds of this.currentExp.defaultSockets) {
      this.engine.installIC(ds.socketId, ds.partNumber);
    }
    this.boardView.renderSockets();

    // Add all reference wires
    for (const w of this.currentExp.referenceWiring) {
      this.engine.addWire(w.from, w.to, w.color);
    }

    this.handleCircuitStateChange();
    this.showToast(`Reference circuit loaded for ${this.currentExp.title}`);
  }

  handleCircuitStateChange() {
    const simResult = this.engine.simulate();
    this.boardView.updateSimVisuals(simResult);
    this.wireManager.render();

    // Update Live Truth table active row highlight if on truthtable tab
    if (this.manualPanel && this.manualPanel.activeTab === 'truthtable') {
      const activeTabContent = document.getElementById('manual-tab-content');
      if (activeTabContent) {
        activeTabContent.innerHTML = this.manualPanel.renderTabContent();
      }
    }
  }

  verifyCurrentExperiment() {
    const report = this.verifier.verify(this.currentExp);
    this.lastReport = report;
    if (report.passed) {
      this.manualPanel.markCompleted(this.currentExp.id);
    }
    this.openVerificationModal(report);
  }

  openICPicker(socketId) {
    this.targetSocketForPicker = socketId;
    const modal = document.getElementById('ic-picker-modal');
    const grid = document.getElementById('ic-picker-grid');
    if (!modal || !grid) return;
    grid.innerHTML = '';

    const categories = ['Gates', 'MSI'];
    for (const cat of categories) {
      const header = document.createElement('h4');
      header.className = 'ic-cat-title';
      header.textContent = cat === 'Gates' ? 'Basic Logic Gates (74xx)' : 'MSI & Sequential ICs (MUX, Decoder, Flip-Flops, Counters, Shift Registers)';
      grid.appendChild(header);

      const catGrid = document.createElement('div');
      catGrid.className = 'ic-chips-row';

      for (const [part, def] of Object.entries(IC_DEFINITIONS)) {
        if (def.category === cat) {
          const chipBtn = document.createElement('button');
          chipBtn.className = 'ic-selection-item';
          chipBtn.innerHTML = `
            <span class="chip-part">${def.partNumber}</span>
            <span class="chip-name">${def.name}</span>
            <span class="chip-pins">${def.pinCount} Pins</span>
          `;
          chipBtn.addEventListener('click', () => {
            this.engine.installIC(this.targetSocketForPicker, part);
            this.boardView.renderSockets();
            this.handleCircuitStateChange();
            this.closeICPicker();
            this.showToast(`Inserted IC ${part} into Socket ${this.targetSocketForPicker + 1}`);
          });
          catGrid.appendChild(chipBtn);
        }
      }
      grid.appendChild(catGrid);
    }

    modal.classList.add('visible');
  }

  closeICPicker() {
    const modal = document.getElementById('ic-picker-modal');
    if (modal) modal.classList.remove('visible');
    this.targetSocketForPicker = null;
  }

  openVerificationModal(report) {
    const modal = document.getElementById('verification-modal');
    const body = document.getElementById('verification-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="report-header ${report.passed ? 'pass-banner' : 'fail-banner'}">
        <div class="banner-icon">${report.passed ? 'PASS' : 'FAIL'}</div>
        <div class="banner-text">
          <h3>${report.passed ? 'EXPERIMENT VERIFIED &amp; APPROVED' : 'VERIFICATION INCOMPLETE'}</h3>
          <span>${report.experimentTitle}</span>
        </div>
        <div class="report-timestamp">${report.timestamp}</div>
      </div>

      <!-- Instructor Checks -->
      <div class="report-section">
        <h4>1. Lab Instructor Safety &amp; Rule Checklist</h4>
        <div class="checklist-items">
          ${report.structuralChecks.map(c => `
            <div class="check-row ${c.status === 'PASSED' ? 'row-pass' : 'row-fail'}">
              <span class="chk-badge">${c.status === 'PASSED' ? 'PASS' : 'FAIL'}</span>
              <div class="chk-info">
                <strong>${c.title}</strong>
                <p>${c.detail}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Truth Table Test Matrix -->
      <div class="report-section">
        <h4>2. Truth Table Dynamic Test Matrix</h4>
        <div class="report-table-scroll">
          <table class="report-tt-table">
            <thead>
              <tr>
                <th>Test Vector</th>
                <th>Test Inputs</th>
                <th>Expected Outputs</th>
                <th>Actual Board LEDs</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${report.rowResults.map(r => `
                <tr class="${r.passed ? 'row-ok' : 'row-err'}">
                  <td>Vector ${r.rowIdx + 1}</td>
                  <td><code>${r.inputs.join(', ')}</code></td>
                  <td><code>${r.expectedOutputs.join(', ')}</code></td>
                  <td><code>${r.actualOutputs.join(', ')}</code></td>
                  <td><span class="res-pill ${r.passed ? 'ok' : 'err'}">${r.passed ? 'PASS' : 'FAIL'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    modal.classList.add('visible');
  }

  closeVerificationModal() {
    const modal = document.getElementById('verification-modal');
    if (modal) modal.classList.remove('visible');
  }

  setupToolbarEvents() {
    // ---- Defensive helper ----
    const $btn = (id) => document.getElementById(id);

    // Clear wires
    const btnClear = $btn('btn-clear-wires');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        this.wireManager.setSelectedWire(null);
        this.engine.clearWires();
        this.handleCircuitStateChange();
        this.wireManager.render();
        this.showToast('All patch cords cleared.');
      });
    }

    // Remove single selected wire
    const btnRemoveWire = $btn('btn-remove-wire');
    if (btnRemoveWire) {
      btnRemoveWire.addEventListener('click', () => {
        if (this.wireManager.selectedWireId) {
          this.wireManager.removeSelectedWire();
          this.handleCircuitStateChange();
          this.showToast('Selected wire removed.');
        } else {
          this.showToast('Click a wire to select it first.');
        }
      });
    }

    // Reset board
    const btnReset = $btn('btn-reset-board');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.boardView.stopClockAutoRun();
        this.engine.setClock(0);
        this.wireManager.setSelectedWire(null);
        this.engine.clearWires();
        for (let s = 0; s < this.engine.sockets.length; s++) {
          this.engine.removeIC(s);
        }
        for (let i = 0; i < 8; i++) {
          this.engine.setSwitch(i, 0);
        }
        this.boardView.renderSockets();
        this.boardView.renderSwitches();
        this.handleCircuitStateChange();
        this.wireManager.render();
        this.showToast('Trainer kit reset: ICs ejected, switches reset, wires cleared.');
      });
    }

    // Master Power toggle
    const btnPwr = $btn('btn-master-power');
    if (btnPwr) {
      btnPwr.addEventListener('click', () => {
        btnPwr.classList.toggle('active');
        const isActive = btnPwr.classList.contains('active');
        const vDisplay = $btn('voltage-display');
        if (vDisplay) {
          vDisplay.textContent = isActive ? '5.02 V' : '0.00 V';
        }
      });
    }
  }

  setupModalEvents() {
    const $btn = (id) => document.getElementById(id);

    // Close IC picker
    const btnCloseIC = $btn('btn-close-ic-picker');
    if (btnCloseIC) {
      btnCloseIC.addEventListener('click', () => {
        this.closeICPicker();
      });
    }

    // Close verification modal
    const btnCloseVerify = $btn('btn-close-verification');
    if (btnCloseVerify) {
      btnCloseVerify.addEventListener('click', () => {
        this.closeVerificationModal();
      });
    }

    // Lab Guide modal open/close
    const btnGuide = $btn('btn-open-guide');
    const guideModal = $btn('lab-guide-modal');
    const btnCloseGuide = $btn('btn-close-guide');

    if (btnGuide && guideModal) {
      btnGuide.addEventListener('click', () => {
        guideModal.classList.add('visible');
      });
    }
    if (btnCloseGuide && guideModal) {
      btnCloseGuide.addEventListener('click', () => {
        guideModal.classList.remove('visible');
      });
    }

    // Close modals on backdrop click
    document.querySelectorAll('.app-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('visible');
        }
      });
    });
  }
}

// Global bootstrap — wrap in try/catch so errors are visible
window.addEventListener('DOMContentLoaded', () => {
  try {
    window.app = new TrainerApp();
  } catch (err) {
    console.error('TrainerApp boot error:', err);
    // Show a visible error banner so the user/developer can see it
    const errBanner = document.createElement('div');
    errBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#dc2626;color:#fff;padding:12px 20px;font-family:monospace;font-size:13px;z-index:9999;white-space:pre-wrap;';
    errBanner.textContent = '⚠ App Boot Error: ' + err.message + '\n' + (err.stack || '');
    document.body.appendChild(errBanner);
  }
});
