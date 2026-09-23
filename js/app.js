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

    // Bind engine change events
    this.engine.onChange(() => {
      this.handleCircuitStateChange();
    });

    // Window resize handler for wire rendering
    window.addEventListener('resize', () => {
      this.wireManager.render();
    });

    this.setupToolbarEvents();
    this.setupModalEvents();
    this.setupSidebarToggle();
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
  }

  loadExperiment(exp) {
    this.currentExp = exp;
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

    this.boardView.renderSockets();
    this.manualPanel.setExperiment(exp);
    this.handleCircuitStateChange();
    this.showToast(`Loaded ${exp.title}`);
  }

  loadReferenceCircuit() {
    if (!this.currentExp) return;
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
    if (this.manualPanel.activeTab === 'truthtable') {
      const activeTabContent = document.getElementById('manual-tab-content');
      if (activeTabContent) {
        activeTabContent.innerHTML = this.manualPanel.renderTabContent();
      }
    }
  }

  verifyCurrentExperiment() {
    const report = this.verifier.verify(this.currentExp);
    if (report.passed) {
      this.manualPanel.markCompleted(this.currentExp.id);
    }
    this.openVerificationModal(report);
  }

  openICPicker(socketId) {
    this.targetSocketForPicker = socketId;
    const modal = document.getElementById('ic-picker-modal');
    const grid = document.getElementById('ic-picker-grid');
    grid.innerHTML = '';

    const categories = ['Gates', 'MSI'];
    for (const cat of categories) {
      const header = document.createElement('h4');
      header.className = 'ic-cat-title';
      header.textContent = cat === 'Gates' ? 'Basic Logic Gates (74xx)' : 'MSI Functional ICs (MUX, Decoder, Encoder, Comparator)';
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
    modal.classList.remove('visible');
    this.targetSocketForPicker = null;
  }

  openVerificationModal(report) {
    const modal = document.getElementById('verification-modal');
    const body = document.getElementById('verification-modal-body');

    body.innerHTML = `
      <div class="report-header ${report.passed ? 'pass-banner' : 'fail-banner'}">
        <div class="banner-icon">${report.passed ? 'PASS' : 'FAIL'}</div>
        <div class="banner-text">
          <h3>${report.passed ? 'EXPERIMENT VERIFIED & APPROVED' : 'VERIFICATION INCOMPLETE'}</h3>
          <span>${report.experimentTitle}</span>
        </div>
        <div class="report-timestamp">${report.timestamp}</div>
      </div>

      <!-- Instructor Checks -->
      <div class="report-section">
        <h4>1. Lab Instructor Safety & Rule Checklist</h4>
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
    modal.classList.remove('visible');
  }

  setupToolbarEvents() {
    // Clear wires: works directly on click without blocking popups!
    document.getElementById('btn-clear-wires').addEventListener('click', () => {
      this.engine.clearWires();
      this.handleCircuitStateChange();
      this.wireManager.render();
      this.showToast('All patch cords cleared.');
    });

    // Reset board: works directly on click
    document.getElementById('btn-reset-board').addEventListener('click', () => {
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

    // Master Power toggle
    const btnPwr = document.getElementById('btn-master-power');
    if (btnPwr) {
      btnPwr.addEventListener('click', () => {
        btnPwr.classList.toggle('active');
        const isActive = btnPwr.classList.contains('active');
        const vDisplay = document.getElementById('voltage-display');
        if (vDisplay) {
          vDisplay.textContent = isActive ? '5.02 V' : '0.00 V';
        }
      });
    }
  }

  setupModalEvents() {
    // Close IC picker
    document.getElementById('btn-close-ic-picker').addEventListener('click', () => {
      this.closeICPicker();
    });

    // Close verification modal
    document.getElementById('btn-close-verification').addEventListener('click', () => {
      this.closeVerificationModal();
    });

    // Lab Guide modal
    const btnGuide = document.getElementById('btn-open-guide');
    const guideModal = document.getElementById('lab-guide-modal');
    const btnCloseGuide = document.getElementById('btn-close-guide');

    if (btnGuide && guideModal && btnCloseGuide) {
      btnGuide.addEventListener('click', () => {
        guideModal.classList.add('visible');
      });
      btnCloseGuide.addEventListener('click', () => {
        guideModal.classList.remove('visible');
      });
    }
  }
}

// Global bootstrap
window.addEventListener('DOMContentLoaded', () => {
  window.app = new TrainerApp();
});
