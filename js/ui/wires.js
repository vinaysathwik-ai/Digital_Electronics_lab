/**
 * Interactive Patch Cord and Wiring System
 * Magnetic snapping, click-or-drag wiring, natural Bézier curves,
 * generous target tolerance, and wire selection/deletion.
 */

class WireManager {
  constructor(engine, svgContainer) {
    this.engine = engine;
    this.svg = svgContainer;
    this.activeWire = null; // Wire currently being drawn
    this.selectedWireId = null;
    this.currentColor = '#e53935'; // Default red
    this.colorPalette = [
      '#e53935', // Red (Vcc)
      '#1e88e5', // Blue (GND / Signal)
      '#fbc02d', // Yellow
      '#43a047', // Green
      '#8e24aa', // Purple
      '#fb8c00', // Orange
      '#00acc1', // Cyan
      '#37474f'  // Charcoal
    ];
    this.colorIdx = 0;
    this.terminals = new Map(); // nodeKey -> DOMElement
    this.snappedTerminalKey = null; // Key of terminal currently snapped to
    this.initEventListeners();
  }

  registerTerminal(nodeKey, element) {
    this.terminals.set(nodeKey, element);
    element.dataset.nodeKey = nodeKey;
    element.classList.add('trainer-terminal');
  }

  unregisterTerminal(nodeKey) {
    this.terminals.delete(nodeKey);
  }

  clearTerminals() {
    this.terminals.clear();
  }

  getTerminalCenter(element) {
    if (!element || !element.isConnected) return null;
    const rect = element.getBoundingClientRect();
    if (!this.svg) return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const svgRect = this.svg.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - svgRect.left,
      y: rect.top + rect.height / 2 - svgRect.top
    };
  }

  getNodeCoordinates(nodeKey) {
    const el = this.terminals.get(nodeKey);
    if (el && el.isConnected) {
      return this.getTerminalCenter(el);
    }
    const doc = (this.svg && this.svg.ownerDocument) ? this.svg.ownerDocument : document;
    const found = doc.querySelector(`[data-node-key="${nodeKey}"]`);
    if (found) {
      this.terminals.set(nodeKey, found);
      return this.getTerminalCenter(found);
    }
    return null;
  }

  /**
   * Find closest terminal to cursor within a generous magnetic radius (e.g. 40px)
   */
  findNearestTerminal(clientX, clientY, excludeNodeKey, maxDistance = 42) {
    let nearest = null;
    let minD = maxDistance;

    for (const [key, el] of this.terminals.entries()) {
      if (key === excludeNodeKey) continue;
      if (!el.isConnected) continue;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - centerX, clientY - centerY);

      if (dist < minD) {
        minD = dist;
        nearest = { key, element: el, dist };
      }
    }

    return nearest;
  }

  initEventListeners() {
    const doc = (this.svg && this.svg.ownerDocument) ? this.svg.ownerDocument : document;

    // Pointer down on terminal
    doc.addEventListener('pointerdown', (e) => {
      // Don't intercept UI buttons, switches, or modal elements
      if (e.target.closest('button') || e.target.closest('.rocker-btn') || e.target.closest('.exp-dropdown')) {
        return;
      }

      // Check direct terminal click
      let terminal = e.target.closest('.trainer-terminal');

      // If not clicking directly on jack, check if clicking close to one
      if (!terminal) {
        const near = this.findNearestTerminal(e.clientX, e.clientY, null, 25);
        if (near) terminal = near.element;
      }

      if (terminal) {
        e.preventDefault();
        const clickedKey = terminal.dataset.nodeKey;

        if (!this.activeWire) {
          // Start drawing wire
          this.startDrawingWire(clickedKey, e);
        } else {
          // If we already had an active wire started (click-to-connect mode)
          if (clickedKey !== this.activeWire.from) {
            this.completeDrawingWire(clickedKey);
          } else {
            this.cancelDrawingWire();
          }
        }
      } else {
        // Clicked empty space
        if (this.activeWire) {
          // If in click-to-connect mode, check if near terminal
          const near = this.findNearestTerminal(e.clientX, e.clientY, this.activeWire.from, 38);
          if (near) {
            this.completeDrawingWire(near.key);
          } else {
            this.cancelDrawingWire();
          }
        } else {
          // Deselect wire if clicking elsewhere
          if (!e.target.closest('.patch-wire-group')) {
            this.setSelectedWire(null);
          }
        }
      }
    });

    // Pointer move for wire dragging & magnetic preview
    doc.addEventListener('pointermove', (e) => {
      if (this.activeWire) {
        this.updateDrawingWire(e);
      }
    });

    // Pointer up to complete drag
    doc.addEventListener('pointerup', (e) => {
      if (this.activeWire) {
        // Check if cursor moved significantly (drag) or stayed near start (click)
        const dx = Math.abs(e.clientX - this.activeWire.clientStartX);
        const dy = Math.abs(e.clientY - this.activeWire.clientStartY);
        const isDrag = Math.hypot(dx, dy) > 10;

        if (isDrag) {
          // It was a drag gesture! Look for target terminal
          let targetKey = null;

          // 1. Check if magnetic snap has already locked onto a terminal
          if (this.snappedTerminalKey && this.snappedTerminalKey !== this.activeWire.from) {
            targetKey = this.snappedTerminalKey;
          } else {
            // 2. Search under cursor with elementFromPoint
            const elUnder = doc.elementFromPoint(e.clientX, e.clientY);
            const terminal = elUnder ? elUnder.closest('.trainer-terminal') : null;
            if (terminal && terminal.dataset.nodeKey !== this.activeWire.from) {
              targetKey = terminal.dataset.nodeKey;
            } else {
              // 3. Generous proximity check (within 45px of any port!)
              const near = this.findNearestTerminal(e.clientX, e.clientY, this.activeWire.from, 45);
              if (near) targetKey = near.key;
            }
          }

          if (targetKey) {
            this.completeDrawingWire(targetKey);
          } else {
            this.cancelDrawingWire();
          }
        } else {
          // It was a simple click! Keep wire active so user can click destination terminal
          // (Click-to-connect mode)
        }
      }
    });

    // Keyboard delete
    doc.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedWireId) {
        this.engine.removeWire(this.selectedWireId);
        this.setSelectedWire(null);
        e.preventDefault();
      } else if (e.key === 'Escape' && this.activeWire) {
        this.cancelDrawingWire();
      }
    });
  }

  startDrawingWire(fromKey, event) {
    const p1 = this.getNodeCoordinates(fromKey);
    if (!p1) return;

    const svgRect = this.svg ? this.svg.getBoundingClientRect() : { left: 0, top: 0 };
    const curX = event.clientX - svgRect.left;
    const curY = event.clientY - svgRect.top;

    // Pick color based on terminal if Vcc or GND
    let wireColor = this.currentColor;
    if (fromKey.startsWith('VCC') || fromKey.includes('P14') || fromKey.includes('P16')) {
      wireColor = '#e53935';
    } else if (fromKey.startsWith('GND') || fromKey.includes('P7') || fromKey.includes('P8')) {
      wireColor = '#1e88e5';
    } else {
      wireColor = this.colorPalette[this.colorIdx % this.colorPalette.length];
    }

    this.activeWire = {
      from: fromKey,
      color: wireColor,
      startX: p1.x,
      startY: p1.y,
      currentX: curX,
      currentY: curY,
      clientStartX: event.clientX,
      clientStartY: event.clientY
    };

    // Highlight source terminal
    const srcEl = this.terminals.get(fromKey);
    if (srcEl) srcEl.classList.add('wiring-source-active');

    this.render();
  }

  updateDrawingWire(event) {
    if (!this.activeWire || !this.svg) return;
    const svgRect = this.svg.getBoundingClientRect();

    // Check magnetic snap to closest port
    const near = this.findNearestTerminal(event.clientX, event.clientY, this.activeWire.from, 40);

    // Clear previous snap highlight
    if (this.snappedTerminalKey && (!near || near.key !== this.snappedTerminalKey)) {
      const prevEl = this.terminals.get(this.snappedTerminalKey);
      if (prevEl) prevEl.classList.remove('magnetic-snap-highlight');
      this.snappedTerminalKey = null;
    }

    if (near) {
      // Snap wire coordinates to center of nearest terminal!
      this.snappedTerminalKey = near.key;
      near.element.classList.add('magnetic-snap-highlight');
      const snapCoord = this.getNodeCoordinates(near.key);
      if (snapCoord) {
        this.activeWire.currentX = snapCoord.x;
        this.activeWire.currentY = snapCoord.y;
      }
    } else {
      this.activeWire.currentX = event.clientX - svgRect.left;
      this.activeWire.currentY = event.clientY - svgRect.top;
    }

    this.render();
  }

  completeDrawingWire(toKey) {
    if (!this.activeWire) return;
    const fromKey = this.activeWire.from;
    const color = this.activeWire.color;

    // Clean up highlights
    this.cleanupHighlights();

    if (fromKey !== toKey) {
      // Add wire to engine
      const wire = this.engine.addWire(fromKey, toKey, color);
      if (wire) {
        this.colorIdx++;
      }
    }

    this.activeWire = null;
    this.snappedTerminalKey = null;
    this.render();
  }

  cancelDrawingWire() {
    this.cleanupHighlights();
    this.activeWire = null;
    this.snappedTerminalKey = null;
    this.render();
  }

  cleanupHighlights() {
    if (this.activeWire) {
      const srcEl = this.terminals.get(this.activeWire.from);
      if (srcEl) srcEl.classList.remove('wiring-source-active');
    }
    if (this.snappedTerminalKey) {
      const snapEl = this.terminals.get(this.snappedTerminalKey);
      if (snapEl) snapEl.classList.remove('magnetic-snap-highlight');
    }
    for (const el of this.terminals.values()) {
      el.classList.remove('magnetic-snap-highlight', 'wiring-source-active');
    }
  }

  setSelectedWire(wireId) {
    this.selectedWireId = wireId;
    this.render();
  }

  /**
   * Calculate natural sagging Bézier curve between (x1, y1) and (x2, y2)
   */
  calculateWirePath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);

    // Natural catenary-like sag proportional to horizontal and total distance
    const sag = Math.min(80, Math.max(25, dist * 0.22));

    // Control points
    const cp1x = x1 + dx * 0.25;
    const cp1y = y1 + Math.max(dy * 0.25, 0) + sag;

    const cp2x = x1 + dx * 0.75;
    const cp2y = y2 + Math.max(-dy * 0.25, 0) + sag;

    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  render() {
    if (!this.svg) return;

    // Clear svg contents
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // SVG Defs for wire shadows and gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="wire-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="rgba(0,0,0,0.65)" />
      </filter>
      <filter id="active-wire-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ffd54f" flood-opacity="0.9" />
      </filter>
    `;
    this.svg.appendChild(defs);

    // Render permanent wires
    for (const wire of this.engine.wires) {
      const p1 = this.getNodeCoordinates(wire.from);
      const p2 = this.getNodeCoordinates(wire.to);
      if (!p1 || !p2) continue;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.classList.add('patch-wire-group');
      if (wire.id === this.selectedWireId) group.classList.add('selected');

      const pathData = this.calculateWirePath(p1.x, p1.y, p2.x, p2.y);

      // Invisible thick hit area for easy clicking
      const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hitPath.setAttribute('d', pathData);
      hitPath.setAttribute('fill', 'none');
      hitPath.setAttribute('stroke', 'transparent');
      hitPath.setAttribute('stroke-width', '24');
      hitPath.style.cursor = 'pointer';

      // Outer rubber casing shadow
      const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      shadowPath.setAttribute('d', pathData);
      shadowPath.setAttribute('fill', 'none');
      shadowPath.setAttribute('stroke', 'rgba(0,0,0,0.4)');
      shadowPath.setAttribute('stroke-width', '7');
      shadowPath.setAttribute('stroke-linecap', 'round');
      shadowPath.setAttribute('filter', 'url(#wire-shadow)');
      shadowPath.style.pointerEvents = 'none';

      // Main colored wire
      const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      mainPath.setAttribute('d', pathData);
      mainPath.setAttribute('fill', 'none');
      mainPath.setAttribute('stroke', wire.color);
      mainPath.setAttribute('stroke-width', wire.id === this.selectedWireId ? '7' : '5');
      mainPath.setAttribute('stroke-linecap', 'round');
      mainPath.style.pointerEvents = 'none';
      if (wire.id === this.selectedWireId) {
        mainPath.setAttribute('filter', 'url(#active-wire-glow)');
      }

      // Specular shine line along wire
      const shinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      shinePath.setAttribute('d', pathData);
      shinePath.setAttribute('fill', 'none');
      shinePath.setAttribute('stroke', 'rgba(255,255,255,0.45)');
      shinePath.setAttribute('stroke-width', '1.5');
      shinePath.setAttribute('stroke-linecap', 'round');
      shinePath.style.pointerEvents = 'none';

      // Terminal plug collars at both ends
      const plug1 = this.createPlugTerminal(p1.x, p1.y, wire.color);
      const plug2 = this.createPlugTerminal(p2.x, p2.y, wire.color);
      plug1.style.pointerEvents = 'none';
      plug2.style.pointerEvents = 'none';

      group.appendChild(shadowPath);
      group.appendChild(mainPath);
      group.appendChild(shinePath);
      group.appendChild(plug1);
      group.appendChild(plug2);
      group.appendChild(hitPath);

      // Event listener on wire: click selects or deletes
      group.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setSelectedWire(wire.id);
      });

      this.svg.appendChild(group);
    }

    // Render active dragging wire
    if (this.activeWire) {
      const { startX, startY, currentX, currentY, color } = this.activeWire;
      const pathData = this.calculateWirePath(startX, startY, currentX, currentY);

      const dragGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      dragGroup.classList.add('patch-wire-drag');
      dragGroup.style.pointerEvents = 'none'; // NEVER block pointer events to ports!

      const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      shadow.setAttribute('d', pathData);
      shadow.setAttribute('fill', 'none');
      shadow.setAttribute('stroke', 'rgba(0,0,0,0.5)');
      shadow.setAttribute('stroke-width', '7');
      shadow.setAttribute('stroke-linecap', 'round');
      shadow.setAttribute('filter', 'url(#wire-shadow)');
      shadow.style.pointerEvents = 'none';

      const cord = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      cord.setAttribute('d', pathData);
      cord.setAttribute('fill', 'none');
      cord.setAttribute('stroke', color);
      cord.setAttribute('stroke-width', '5.5');
      cord.setAttribute('stroke-dasharray', '8 4');
      cord.setAttribute('stroke-linecap', 'round');
      cord.style.pointerEvents = 'none';

      const plugStart = this.createPlugTerminal(startX, startY, color);
      const plugEnd = this.createPlugTerminal(currentX, currentY, color);
      plugStart.style.pointerEvents = 'none';
      plugEnd.style.pointerEvents = 'none';

      dragGroup.appendChild(shadow);
      dragGroup.appendChild(cord);
      dragGroup.appendChild(plugStart);
      dragGroup.appendChild(plugEnd);

      this.svg.appendChild(dragGroup);
    }
  }

  createPlugTerminal(x, y, color) {
    const plug = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    plug.innerHTML = `
      <circle cx="${x}" cy="${y}" r="7" fill="#212121" stroke="#424242" stroke-width="1.5" />
      <circle cx="${x}" cy="${y}" r="4.5" fill="${color}" />
      <circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.5" fill="rgba(255,255,255,0.7)" />
    `;
    return plug;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WireManager };
}
