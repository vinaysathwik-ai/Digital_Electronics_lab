/**
 * Physical Trainer Kit Board View
 * Renders the PCB-textured board, VCC and GND distribution rails,
 * 8-channel DIP switches, 8-channel LED logic indicators, and 4 DIP IC sockets.
 */

class BoardView {
  constructor(engine, containerEl, wireManager) {
    this.engine = engine;
    this.container = containerEl;
    this.wireManager = wireManager;
    this.simResult = null;
    this.initBoardDOM();
  }

  initBoardDOM() {
    this.container.innerHTML = `
      <div class="trainer-chassis">
        <!-- Top Control & Header Banner -->
        <header class="chassis-header">
          <div class="trainer-branding">
            <span class="brand-badge">SRM SEAS</span>
            <div class="brand-titles">
              <h2>DIGITAL IC TRAINER KIT</h2>
              <span class="sub-text">MODEL DE-211 / CSE-207 • VIRTUAL LAB</span>
            </div>
          </div>
          <div class="master-power-block">
            <div class="voltage-readout">
              <span class="readout-label">+5.0V REGULATED DC</span>
              <span class="readout-val" id="voltage-display">5.02 V</span>
            </div>
            <div class="power-toggle-wrap">
              <span class="pwr-label">MAIN POWER</span>
              <button class="main-power-switch active" id="btn-master-power" title="Toggle Trainer Kit Main Power">
                <span class="switch-knob"></span>
              </button>
            </div>
          </div>
        </header>

        <!-- Top Power Rail (VCC +5V) -->
        <div class="power-rail vcc-rail">
          <div class="rail-label">
            <span class="rail-indicator vcc-on"></span>
            <strong>+5V (Vcc) POWER RAIL</strong>
          </div>
          <div class="rail-terminals" id="vcc-terminals">
            <!-- 8 Red banana jacks for VCC -->
          </div>
        </div>

        <!-- Main Workspace Area -->
        <div class="trainer-main-deck">
          <!-- Left: 8 DIP Toggle Switches -->
          <div class="deck-section switch-bank-section">
            <div class="section-title">
              <span>LOGIC INPUT SWITCHES</span>
              <span class="info-tag">TTL 0/1</span>
            </div>
            <div class="switch-grid" id="switch-grid">
              <!-- 8 switches -->
            </div>
          </div>

          <!-- Center: Breadboard IC Bay (4 Sockets) -->
          <div class="deck-section ic-bay-section">
            <div class="section-title">
              <span>IC BREADBOARD SOCKET BAY</span>
              <span class="info-tag">DUAL-IN-LINE SOCKETS 1–4</span>
            </div>
            <div class="ic-sockets-grid" id="ic-sockets-grid">
              <!-- 4 IC Sockets -->
            </div>
          </div>

          <!-- Right: 8 LED Logic Indicators -->
          <div class="deck-section led-bank-section">
            <div class="section-title">
              <span>LOGIC OUTPUT INDICATORS</span>
              <span class="info-tag">ACTIVE HIGH (1=ON)</span>
            </div>
            <div class="led-grid" id="led-grid">
              <!-- 8 LEDs -->
            </div>
          </div>
        </div>

        <!-- Bottom Power Rail (GND 0V) -->
        <div class="power-rail gnd-rail">
          <div class="rail-label">
            <span class="rail-indicator gnd-on"></span>
            <strong>GROUND (0V) RAIL</strong>
          </div>
          <div class="rail-terminals" id="gnd-terminals">
            <!-- 8 Black banana jacks for GND -->
          </div>
        </div>

        <!-- SVG Wiring Overlay on top of the entire board -->
        <svg class="trainer-wire-overlay" id="wire-svg" xmlns="http://www.w3.org/2000/svg"></svg>
      </div>
    `;

    this.renderPowerRails();
    this.renderSwitches();
    this.renderLEDs();
    this.renderSockets();
  }

  renderPowerRails() {
    const vccCont = this.container.querySelector('#vcc-terminals');
    const gndCont = this.container.querySelector('#gnd-terminals');
    vccCont.innerHTML = '';
    gndCont.innerHTML = '';

    for (let i = 0; i < 8; i++) {
      // VCC terminal
      const vccJack = document.createElement('div');
      vccJack.className = 'banana-jack jack-red trainer-terminal';
      vccJack.dataset.nodeKey = `VCC_${i}`;
      vccJack.title = `VCC Jack ${i+1} (+5V Power Source)`;
      vccJack.innerHTML = `
        <span class="jack-rim"></span>
        <span class="jack-hole"></span>
        <span class="jack-text">+5V</span>
      `;
      vccCont.appendChild(vccJack);
      this.wireManager.registerTerminal(`VCC_${i}`, vccJack);
      if (i === 0) {
        this.wireManager.registerTerminal('VCC', vccJack);
      }

      // GND terminal
      const gndJack = document.createElement('div');
      gndJack.className = 'banana-jack jack-black trainer-terminal';
      gndJack.dataset.nodeKey = `GND_${i}`;
      gndJack.title = `GND Jack ${i+1} (Ground Source)`;
      gndJack.innerHTML = `
        <span class="jack-rim"></span>
        <span class="jack-hole"></span>
        <span class="jack-text">GND</span>
      `;
      gndCont.appendChild(gndJack);
      this.wireManager.registerTerminal(`GND_${i}`, gndJack);
      if (i === 0) {
        this.wireManager.registerTerminal('GND', gndJack);
      }
    }
  }

  renderSwitches() {
    const swGrid = this.container.querySelector('#switch-grid');
    swGrid.innerHTML = '';

    for (let i = 7; i >= 0; i--) {
      const swVal = this.engine.switches[i];
      const swCard = document.createElement('div');
      swCard.className = `switch-card ${swVal ? 'active' : ''}`;
      swCard.id = `sw-card-${i}`;
      swCard.innerHTML = `
        <div class="sw-header">
          <span class="sw-name">SW${i}</span>
          <span class="sw-state-badge ${swVal ? 'high' : 'low'}">${swVal ? '1' : '0'}</span>
        </div>
        <div class="rocker-switch-box">
          <button class="rocker-btn ${swVal ? 'on' : 'off'}" data-sw-index="${i}" title="Toggle Switch ${i}">
            <div class="rocker-lever">
              <span class="rocker-mark on-mark">1</span>
              <span class="rocker-pivot"></span>
              <span class="rocker-mark off-mark">0</span>
            </div>
          </button>
        </div>
        <div class="sw-terminal-wrap">
          <div class="banana-jack jack-yellow trainer-terminal" data-node-key="SW_${i}" title="Switch ${i} Output">
            <span class="jack-rim"></span>
            <span class="jack-hole"></span>
          </div>
          <span class="jack-caption">OUT</span>
        </div>
      `;

      // Event listener for toggle
      const btn = swCard.querySelector('.rocker-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.engine.toggleSwitch(i);
        if (typeof window !== 'undefined' && window.app && window.app.playSound) {
          window.app.playSound('toggle');
        }
      });

      const jack = swCard.querySelector('.banana-jack');
      this.wireManager.registerTerminal(`SW_${i}`, jack);

      swGrid.appendChild(swCard);
    }
  }

  renderLEDs() {
    const ledGrid = this.container.querySelector('#led-grid');
    ledGrid.innerHTML = '';

    for (let i = 7; i >= 0; i--) {
      const ledCard = document.createElement('div');
      ledCard.className = 'led-card';
      ledCard.id = `led-card-${i}`;
      ledCard.innerHTML = `
        <div class="led-header">
          <span class="led-name">LED${i}</span>
          <span class="led-state-val" id="led-val-${i}">0</span>
        </div>
        <div class="led-bulb-assembly">
          <div class="led-bezel">
            <div class="led-dome" id="led-dome-${i}">
              <div class="led-specular"></div>
            </div>
          </div>
        </div>
        <div class="led-terminal-wrap">
          <div class="banana-jack jack-green trainer-terminal" data-node-key="LED_${i}" title="LED ${i} Input Terminal">
            <span class="jack-rim"></span>
            <span class="jack-hole"></span>
          </div>
          <span class="jack-caption">IN</span>
        </div>
      `;

      const jack = ledCard.querySelector('.banana-jack');
      this.wireManager.registerTerminal(`LED_${i}`, jack);

      ledGrid.appendChild(ledCard);
    }
  }

  renderSockets() {
    const bay = this.container.querySelector('#ic-sockets-grid');
    bay.innerHTML = '';

    for (let s = 0; s < this.engine.sockets.length; s++) {
      const sock = this.engine.sockets[s];
      const sockCard = document.createElement('div');
      sockCard.className = 'ic-socket-card';
      sockCard.id = `socket-card-${s}`;

      if (!sock.ic) {
        // Empty Socket
        sockCard.innerHTML = `
          <div class="socket-top-bar">
            <span class="socket-label">${sock.label}</span>
            <span class="socket-status empty">EMPTY</span>
          </div>
          <div class="empty-socket-well" data-socket-id="${s}">
            <div class="socket-guide">
              <span class="socket-notch-mark"></span>
              <p>Empty 14/16-Pin DIP Socket</p>
              <button class="btn-insert-ic" data-socket-id="${s}">+ Insert IC</button>
            </div>
            <div class="socket-contacts-row top-row">
              ${Array(8).fill('<span class="pin-contact-hole"></span>').join('')}
            </div>
            <div class="socket-contacts-row bottom-row">
              ${Array(8).fill('<span class="pin-contact-hole"></span>').join('')}
            </div>
          </div>
        `;

        const btnInsert = sockCard.querySelector('.btn-insert-ic');
        btnInsert.addEventListener('click', () => {
          if (typeof window !== 'undefined' && window.app && window.app.openICPicker) {
            window.app.openICPicker(s);
          }
        });
      } else {
        // Occupied Socket
        const ic = sock.ic;
        const def = ic.def;
        const pinCount = def.pinCount; // 14 or 16
        const halfPins = pinCount / 2;

        let statusClass = 'off';
        let statusText = 'UNPOWERED';
        if (this.simResult && this.simResult.icStatus[s]) {
          const st = this.simResult.icStatus[s];
          if (st.powered) {
            statusClass = 'active';
            statusText = 'POWERED (+5V)';
          }
        }

        sockCard.innerHTML = `
          <div class="socket-top-bar">
            <div class="socket-title-grp">
              <span class="socket-label">${sock.label}</span>
              <strong class="ic-part-badge">${ic.partNumber}</strong>
            </div>
            <div class="socket-actions">
              <span class="socket-status ${statusClass}">${statusText}</span>
              <button class="btn-eject-ic" data-socket-id="${s}" title="Eject IC from socket">Eject</button>
            </div>
          </div>

          <div class="dip-ic-package ${pinCount === 16 ? 'dip-16' : 'dip-14'}">
            <!-- Top Pins (pinCount down to halfPins + 1) -->
            <div class="ic-pin-row top-pin-row" id="top-pins-${s}"></div>

            <!-- Central Black Epoxy IC Body -->
            <div class="ic-epoxy-body">
              <div class="ic-orientation-notch"></div>
              <div class="ic-pin-one-dot"></div>
              <div class="ic-silkscreen">
                <span class="ic-logo">TI / SN</span>
                <span class="ic-part-num">${ic.partNumber}N</span>
                <span class="ic-desc-tag">${def.name}</span>
              </div>
            </div>

            <!-- Bottom Pins (1 to halfPins) -->
            <div class="ic-pin-row bottom-pin-row" id="bottom-pins-${s}"></div>
          </div>
        `;

        // Render Top Pin terminals
        const topRow = sockCard.querySelector(`#top-pins-${s}`);
        for (let p = pinCount; p > halfPins; p--) {
          const pinEl = this.createPinTerminalElement(s, p, def.pins[p]);
          topRow.appendChild(pinEl);
        }

        // Render Bottom Pin terminals
        const bottomRow = sockCard.querySelector(`#bottom-pins-${s}`);
        for (let p = 1; p <= halfPins; p++) {
          const pinEl = this.createPinTerminalElement(s, p, def.pins[p]);
          bottomRow.appendChild(pinEl);
        }

        // Eject button listener
        const btnEject = sockCard.querySelector('.btn-eject-ic');
        btnEject.addEventListener('click', () => {
          this.engine.removeIC(s);
          if (typeof window !== 'undefined' && window.app && window.app.playSound) {
            window.app.playSound('eject');
          }
        });
      }

      bay.appendChild(sockCard);
    }
  }

  createPinTerminalElement(socketId, pinNumber, pinDef) {
    const pinWrap = document.createElement('div');
    pinWrap.className = `ic-pin-terminal-cell type-${pinDef.type || 'signal'}`;
    const nodeKey = `IC_${socketId}_P${pinNumber}`;

    let roleClass = '';
    if (pinDef.role === 'VCC') roleClass = 'pwr-vcc';
    else if (pinDef.role === 'GND') roleClass = 'pwr-gnd';
    else if (pinDef.type === 'output') roleClass = 'pin-out';
    else roleClass = 'pin-in';

    pinWrap.innerHTML = `
      <div class="pin-number-badge">${pinNumber}</div>
      <div class="banana-jack jack-gold trainer-terminal ${roleClass}" data-node-key="${nodeKey}" title="${pinDef.name} (Pin ${pinNumber})">
        <span class="jack-rim"></span>
        <span class="jack-hole"></span>
        <span class="pin-status-dot" id="dot-${nodeKey}"></span>
      </div>
      <div class="pin-fn-label">${pinDef.name}</div>
    `;

    const jack = pinWrap.querySelector('.banana-jack');
    this.wireManager.registerTerminal(nodeKey, jack);

    return pinWrap;
  }

  /**
   * Update visual states after simulation
   */
  updateSimVisuals(simResult) {
    this.simResult = simResult;

    // 1. Update Switches visual state
    for (let i = 0; i < 8; i++) {
      const swCard = this.container.querySelector(`#sw-card-${i}`);
      if (swCard) {
        const val = this.engine.switches[i];
        swCard.classList.toggle('active', !!val);
        const badge = swCard.querySelector('.sw-state-badge');
        if (badge) {
          badge.textContent = val ? '1' : '0';
          badge.className = `sw-state-badge ${val ? 'high' : 'low'}`;
        }
        const btn = swCard.querySelector('.rocker-btn');
        if (btn) {
          btn.className = `rocker-btn ${val ? 'on' : 'off'}`;
        }
      }
    }

    // 2. Update LEDs
    for (let i = 0; i < 8; i++) {
      const dome = this.container.querySelector(`#led-dome-${i}`);
      const valLabel = this.container.querySelector(`#led-val-${i}`);
      const rawState = simResult.ledRawStates[i];

      if (dome && valLabel) {
        if (rawState === 1) {
          dome.className = 'led-dome lit-high';
          valLabel.textContent = '1 (HIGH)';
          valLabel.className = 'led-state-val high';
        } else if (rawState === 0) {
          dome.className = 'led-dome lit-low';
          valLabel.textContent = '0 (LOW)';
          valLabel.className = 'led-state-val low';
        } else if (rawState === 'SHORT') {
          dome.className = 'led-dome lit-error';
          valLabel.textContent = 'SHORT!';
          valLabel.className = 'led-state-val error';
        } else {
          dome.className = 'led-dome unlit';
          valLabel.textContent = 'FLOATING';
          valLabel.className = 'led-state-val float';
        }
      }
    }

    // 3. Update IC Power status badges and pin voltage dots
    for (let s = 0; s < this.engine.sockets.length; s++) {
      const sockCard = this.container.querySelector(`#socket-card-${s}`);
      if (!sockCard || !this.engine.sockets[s].ic) continue;

      const st = simResult.icStatus[s];
      const statusBadge = sockCard.querySelector('.socket-status');
      if (statusBadge) {
        if (st && st.powered) {
          statusBadge.textContent = 'POWERED (+5V)';
          statusBadge.className = 'socket-status active';
        } else {
          statusBadge.textContent = 'UNPOWERED';
          statusBadge.className = 'socket-status off';
        }
      }

      // Update pin status dots
      const ic = this.engine.sockets[s].ic;
      for (let p = 1; p <= ic.def.pinCount; p++) {
        const nodeKey = `IC_${s}_P${p}`;
        const dot = this.container.querySelector(`#dot-${nodeKey}`);
        if (dot) {
          const val = simResult.nodeValues[nodeKey];
          if (val === 1) dot.className = 'pin-status-dot val-high';
          else if (val === 0) dot.className = 'pin-status-dot val-low';
          else if (val === 'SHORT') dot.className = 'pin-status-dot val-short';
          else dot.className = 'pin-status-dot val-float';
        }
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BoardView };
}
