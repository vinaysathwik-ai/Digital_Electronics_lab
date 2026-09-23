/**
 * Netlist and Circuit Simulation Engine
 * Handles graph connectivity, Union-Find electrical nets, power rules,
 * floating input detection, short-circuit protection, and iterative logic propagation.
 */

let IC_DEFS = typeof IC_DEFINITIONS !== 'undefined' ? IC_DEFINITIONS : null;
if (!IC_DEFS && typeof require !== 'undefined') {
  try {
    IC_DEFS = require('../ics/ic_definitions.js').IC_DEFINITIONS;
  } catch (e) {}
}

class NetlistEngine {
  constructor() {
    this.wires = []; // Array of { id, from, to, color }
    this.sockets = [
      { id: 0, ic: null, label: 'SOCKET 1 (IC 1)' },
      { id: 1, ic: null, label: 'SOCKET 2 (IC 2)' },
      { id: 2, ic: null, label: 'SOCKET 3 (IC 3)' },
      { id: 3, ic: null, label: 'SOCKET 4 (IC 4)' }
    ];
    this.switches = [0, 0, 0, 0, 0, 0, 0, 0]; // 8 DIP switches (0=LOW, 1=HIGH)
    this.wireIdCounter = 1;
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      try { cb(); } catch (err) { console.error('Netlist listener error:', err); }
    }
  }

  addWire(from, to, color = '#e53935') {
    if (!from || !to || from === to) return null;
    
    // Check if wire already exists
    const exists = this.wires.some(w => 
      (w.from === from && w.to === to) || (w.from === to && w.to === from)
    );
    if (exists) return null;

    const wire = {
      id: `w_${this.wireIdCounter++}`,
      from,
      to,
      color
    };
    this.wires.push(wire);
    this.notify();
    return wire;
  }

  removeWire(wireId) {
    const idx = this.wires.findIndex(w => w.id === wireId);
    if (idx !== -1) {
      this.wires.splice(idx, 1);
      this.notify();
      return true;
    }
    return false;
  }

  removeWiresConnectedTo(nodeKey) {
    const initialLen = this.wires.length;
    this.wires = this.wires.filter(w => w.from !== nodeKey && w.to !== nodeKey);
    if (this.wires.length !== initialLen) {
      this.notify();
    }
  }

  clearWires() {
    this.wires = [];
    this.notify();
  }

  installIC(socketId, partNumber) {
    if (socketId < 0 || socketId >= this.sockets.length) return false;
    const defs = typeof IC_DEFINITIONS !== 'undefined' ? IC_DEFINITIONS : IC_DEFS;
    const def = defs ? defs[partNumber] : null;
    if (!def) return false;
    this.sockets[socketId].ic = {
      partNumber,
      def
    };
    this.notify();
    return true;
  }

  removeIC(socketId) {
    if (socketId < 0 || socketId >= this.sockets.length) return false;
    // Remove wires connected to this IC's pins
    const prefix = `IC_${socketId}_P`;
    this.wires = this.wires.filter(w => !w.from.startsWith(prefix) && !w.to.startsWith(prefix));
    this.sockets[socketId].ic = null;
    this.notify();
    return true;
  }

  setSwitch(index, value) {
    if (index >= 0 && index < 8) {
      this.switches[index] = value ? 1 : 0;
      this.notify();
    }
  }

  toggleSwitch(index) {
    if (index >= 0 && index < 8) {
      this.switches[index] = this.switches[index] ? 0 : 1;
      this.notify();
      return this.switches[index];
    }
    return 0;
  }

  /**
   * Run simulation pass
   */
  simulate() {
    const errors = [];
    const warnings = [];

    // 1. Gather all active nodes
    const allNodes = new Set();
    allNodes.add('VCC');
    allNodes.add('GND');
    for (let i = 0; i < 8; i++) {
      allNodes.add(`VCC_${i}`);
      allNodes.add(`GND_${i}`);
      allNodes.add(`SW_${i}`);
      allNodes.add(`LED_${i}`);
    }
    for (let s = 0; s < this.sockets.length; s++) {
      const sock = this.sockets[s];
      if (sock.ic) {
        for (let p = 1; p <= sock.ic.def.pinCount; p++) {
          allNodes.add(`IC_${s}_P${p}`);
        }
      }
    }

    // 2. Build Disjoint-Set / Union-Find for electrical nets
    const parent = {};
    for (const node of allNodes) parent[node] = node;

    function find(i) {
      if (parent[i] === undefined) parent[i] = i;
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    }

    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
      }
    }

    // Internally tie all distribution bus rail jacks to VCC and GND
    for (let i = 0; i < 8; i++) {
      union('VCC', `VCC_${i}`);
      union('GND', `GND_${i}`);
    }

    for (const wire of this.wires) {
      union(wire.from, wire.to);
    }

    // Group nodes by net root
    const netGroups = new Map();
    for (const node of allNodes) {
      const root = find(node);
      if (!netGroups.has(root)) netGroups.set(root, []);
      netGroups.get(root).push(node);
    }

    const vccRoot = find('VCC');
    const gndRoot = find('GND');

    // Check Short Circuit: VCC connected directly to GND
    if (vccRoot === gndRoot) {
      errors.push('CRITICAL SHORT CIRCUIT: VCC (+5V) is directly wired to GND!');
    }

    // 3. Check IC Power conditions
    const icStatus = {};
    for (let s = 0; s < this.sockets.length; s++) {
      const sock = this.sockets[s];
      if (!sock.ic) continue;
      const def = sock.ic.def;
      const vccPinNode = `IC_${s}_P${def.vccPin}`;
      const gndPinNode = `IC_${s}_P${def.gndPin}`;

      const isVccPowered = (find(vccPinNode) === vccRoot) && (vccRoot !== gndRoot);
      const isGndConnected = (find(gndPinNode) === gndRoot) && (vccRoot !== gndRoot);
      const isPowered = isVccPowered && isGndConnected;

      icStatus[s] = {
        powered: isPowered,
        vccConnected: isVccPowered,
        gndConnected: isGndConnected,
        partNumber: sock.ic.partNumber,
        label: sock.label
      };

      if (!isPowered) {
        if (!isVccPowered && !isGndConnected) {
          warnings.push(`${sock.label} (${sock.ic.partNumber}): Power missing (Pin ${def.vccPin} VCC & Pin ${def.gndPin} GND not wired).`);
        } else if (!isVccPowered) {
          warnings.push(`${sock.label} (${sock.ic.partNumber}): Pin ${def.vccPin} (VCC) is not connected to +5V rail.`);
        } else if (!isGndConnected) {
          warnings.push(`${sock.label} (${sock.ic.partNumber}): Pin ${def.gndPin} (GND) is not connected to GND rail.`);
        }
      }
    }

    // 4. Multi-pass Logic Propagation
    // State of each net root: 1, 0, 'Z' (floating), 'SHORT'
    const netValues = {};
    const nodeValues = {};
    const floatingInputs = new Set();

    // Max iteration passes for cascaded logic
    const MAX_PASSES = 15;
    let stabilized = false;

    // Initialize IC outputs
    const icOutputs = {};

    for (let pass = 0; pass < MAX_PASSES; pass++) {
      let changed = false;

      // Net drivers in current pass
      const netDrivers = new Map(); // root -> array of { source, value }

      // Fixed drivers: VCC and GND
      if (vccRoot !== gndRoot) {
        if (!netDrivers.has(vccRoot)) netDrivers.set(vccRoot, []);
        netDrivers.get(vccRoot).push({ source: 'VCC', value: 1 });

        if (!netDrivers.has(gndRoot)) netDrivers.set(gndRoot, []);
        netDrivers.get(gndRoot).push({ source: 'GND', value: 0 });
      }

      // Switches
      for (let i = 0; i < 8; i++) {
        const swRoot = find(`SW_${i}`);
        if (!netDrivers.has(swRoot)) netDrivers.set(swRoot, []);
        netDrivers.get(swRoot).push({ source: `SW_${i}`, value: this.switches[i] });
      }

      // IC outputs from previous/current pass
      for (const [pinNode, val] of Object.entries(icOutputs)) {
        if (val === 1 || val === 0) {
          const pinRoot = find(pinNode);
          if (!netDrivers.has(pinRoot)) netDrivers.set(pinRoot, []);
          netDrivers.get(pinRoot).push({ source: pinNode, value: val });
        }
      }

      // Resolve each net value
      for (const [root, nodes] of netGroups.entries()) {
        const drivers = netDrivers.get(root) || [];
        let resolvedVal = 'Z'; // default floating

        if (drivers.length > 0) {
          const hasOne = drivers.some(d => d.value === 1);
          const hasZero = drivers.some(d => d.value === 0);

          if (hasOne && hasZero) {
            resolvedVal = 'SHORT';
            // Output bus contention
            const names = drivers.map(d => d.source).join(', ');
            const shortMsg = `Bus contention / Output short on net with: ${names}`;
            if (!errors.includes(shortMsg)) errors.push(shortMsg);
          } else if (hasOne) {
            resolvedVal = 1;
          } else if (hasZero) {
            resolvedVal = 0;
          }
        }

        if (netValues[root] !== resolvedVal) {
          netValues[root] = resolvedVal;
          changed = true;
        }

        for (const node of nodes) {
          nodeValues[node] = resolvedVal;
        }
      }

      // Evaluate IC internal logic with currently resolved pin voltages
      for (let s = 0; s < this.sockets.length; s++) {
        const sock = this.sockets[s];
        if (!sock.ic || !icStatus[s].powered) continue;
        const def = sock.ic.def;

        if (def.gates) {
          // Standard gate IC (7408, 7432, 7404, 7400, 7402, 7486, 74266, 7410, 7411)
          for (const gate of def.gates) {
            const inValues = gate.inputs.map(pinNum => {
              const node = `IC_${s}_P${pinNum}`;
              const val = nodeValues[node];
              if (val === 'Z' || val === undefined) {
                floatingInputs.add(node);
                return undefined;
              }
              return val;
            });

            const outNode = `IC_${s}_P${gate.output}`;
            let gateOut = 'Z';
            if (inValues.every(v => v !== undefined && v !== 'SHORT')) {
              gateOut = gate.eval(...inValues);
            }
            if (icOutputs[outNode] !== gateOut) {
              icOutputs[outNode] = gateOut;
              changed = true;
            }
          }
        } else if (def.evaluate) {
          // MSI IC (74153, 74139, 74138, 74148, 7485)
          const pinVals = {};
          for (let p = 1; p <= def.pinCount; p++) {
            const pDef = def.pins[p];
            if (pDef && pDef.type === 'input') {
              const node = `IC_${s}_P${p}`;
              const val = nodeValues[node];
              if (val === 'Z' || val === undefined) {
                floatingInputs.add(node);
                pinVals[p] = undefined;
              } else {
                pinVals[p] = val;
              }
            }
          }

          const evaluatedOutputs = def.evaluate(pinVals);
          for (const [outPin, outVal] of Object.entries(evaluatedOutputs)) {
            const outNode = `IC_${s}_P${outPin}`;
            if (icOutputs[outNode] !== outVal) {
              icOutputs[outNode] = outVal;
              changed = true;
            }
          }
        }
      }

      if (!changed) {
        stabilized = true;
        break;
      }
    }

    // Floating input warnings
    for (const floatPinNode of floatingInputs) {
      const match = floatPinNode.match(/^IC_(\d+)_P(\d+)$/);
      if (match) {
        const s = parseInt(match[1]);
        const p = parseInt(match[2]);
        const sock = this.sockets[s];
        if (sock && sock.ic && icStatus[s].powered) {
          const pinInfo = sock.ic.def.pins[p];
          const pinName = pinInfo ? pinInfo.name : `Pin ${p}`;
          warnings.push(`Floating input detected: ${sock.label} Pin ${p} (${pinName}) is not connected to a driver.`);
        }
      }
    }

    // 5. Compute LED outputs
    const ledOutputs = [0, 0, 0, 0, 0, 0, 0, 0];
    const ledRawStates = ['Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z', 'Z'];
    for (let i = 0; i < 8; i++) {
      const val = nodeValues[`LED_${i}`];
      ledRawStates[i] = val !== undefined ? val : 'Z';
      ledOutputs[i] = (val === 1) ? 1 : 0;
    }

    return {
      errors,
      warnings,
      icStatus,
      nodeValues,
      ledOutputs,
      ledRawStates,
      stabilized
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NetlistEngine };
}
