/**
 * Circuit Topology and Role Verifier
 * Validates logical circuit structure independently of physical switch/LED positions.
 * Discovers physical mappings for logical roles (e.g. A -> SW4, B -> SW7, Y -> LED5)
 * and enforces strict topological integrity (no bridges, no shorts, no bypasses).
 */

class TopologyVerifier {
  constructor() {}

  /**
   * Build electrical nets (connected components) from engine wires and power distribution rails.
   * Normalizes power rails (VCC and GND aliases) without merging switches or LEDs.
   * @param {NetlistEngine} engine
   * @returns {Object} { find, areConnected, getNet, netMap, allNodes }
   */
  buildElectricalNets(engine) {
    const allNodes = new Set();
    allNodes.add('VCC');
    allNodes.add('GND');

    for (let i = 0; i < 8; i++) {
      allNodes.add(`VCC_${i}`);
      allNodes.add(`GND_${i}`);
      allNodes.add(`SW_${i}`);
      allNodes.add(`LED_${i}`);
    }

    for (let s = 0; s < engine.sockets.length; s++) {
      const sock = engine.sockets[s];
      if (sock && sock.ic && sock.ic.def) {
        for (let p = 1; p <= sock.ic.def.pinCount; p++) {
          allNodes.add(`IC_${s}_P${p}`);
        }
      }
    }

    for (const w of engine.wires) {
      if (w.from) allNodes.add(w.from);
      if (w.to) allNodes.add(w.to);
    }

    const parent = {};
    for (const n of allNodes) {
      parent[n] = n;
    }

    function find(n) {
      if (parent[n] === undefined) parent[n] = n;
      if (parent[n] === n) return n;
      parent[n] = find(parent[n]);
      return parent[n];
    }

    function union(a, b) {
      const rootA = find(a);
      const rootB = find(b);
      if (rootA !== rootB) {
        parent[rootA] = rootB;
      }
    }

    // Tie VCC rail distribution jacks together to single logical VCC
    for (let i = 0; i < 8; i++) {
      union('VCC', `VCC_${i}`);
      union('GND', `GND_${i}`);
    }

    // Apply student wires
    for (const w of engine.wires) {
      union(w.from, w.to);
    }

    // Map each root to its constituent set of node terminals
    const netMap = new Map();
    for (const n of allNodes) {
      const root = find(n);
      if (!netMap.has(root)) {
        netMap.set(root, new Set());
      }
      netMap.get(root).add(n);
    }

    function getNet(node) {
      const root = find(node);
      return netMap.get(root) || new Set([node]);
    }

    function areConnected(a, b) {
      return find(a) === find(b);
    }

    return { find, areConnected, getNet, netMap, allNodes };
  }

  /**
   * Derive logical topology from experiment definition or reference wiring fallback.
   * @param {Object} exp - Experiment definition
   * @returns {Object} Normalized topology object
   */
  getTopology(exp) {
    if (exp.topology) {
      return exp.topology;
    }
    return this.extractTopologyFromReference(exp);
  }

  /**
   * Auto-extract logical topology from experiment referenceWiring, inputs, and outputs.
   * @param {Object} exp
   * @returns {Object}
   */
  extractTopologyFromReference(exp) {
    const inputs = [];
    const outputs = [];
    const internalWiring = [];
    const staticWiring = [];

    const refWires = exp.referenceWiring || [];

    // Extract input targets
    for (let i = 0; i < (exp.inputs || []).length; i++) {
      const inpDef = exp.inputs[i];
      const swName = `SW_${inpDef.switchIndex}`;
      const targetPins = [];
      let isPassThrough = false;

      for (const w of refWires) {
        if (w.from === swName && w.to.startsWith('IC_')) targetPins.push(w.to);
        else if (w.to === swName && w.from.startsWith('IC_')) targetPins.push(w.from);
        else if ((w.from === swName && w.to.startsWith('LED_')) || (w.to === swName && w.from.startsWith('LED_'))) {
          isPassThrough = true;
        }
      }

      const cleanRole = inpDef.label
        ? inpDef.label.replace(/\s*\(SW\s*\d+\)/i, '').trim()
        : `IN_${i}`;

      // Check commutativity for basic 2-input gate inputs (A and B)
      const isCommutative = ['exp1_and', 'exp1_or', 'exp1_nand', 'exp1_nor', 'exp1_xor', 'exp3_half_adder'].includes(exp.id);

      inputs.push({
        index: i,
        role: cleanRole,
        pins: targetPins,
        isPassThrough,
        commutativeWith: (isCommutative && (cleanRole === 'A' || cleanRole === 'B'))
          ? (cleanRole === 'A' ? ['B'] : ['A'])
          : []
      });
    }

    // Extract output sources
    for (let j = 0; j < (exp.outputs || []).length; j++) {
      const outDef = exp.outputs[j];
      const ledName = `LED_${outDef.ledIndex}`;
      let sourcePin = null;
      let directInputRole = null;

      for (const w of refWires) {
        if (w.to === ledName) {
          if (w.from.startsWith('IC_')) {
            sourcePin = w.from;
          } else if (w.from.startsWith('SW_')) {
            const swIdx = parseInt(w.from.replace('SW_', ''), 10);
            const matchingInp = inputs.find(inp => exp.inputs[inp.index].switchIndex === swIdx);
            if (matchingInp) directInputRole = matchingInp.role;
          }
        } else if (w.from === ledName) {
          if (w.to.startsWith('IC_')) {
            sourcePin = w.to;
          } else if (w.to.startsWith('SW_')) {
            const swIdx = parseInt(w.to.replace('SW_', ''), 10);
            const matchingInp = inputs.find(inp => exp.inputs[inp.index].switchIndex === swIdx);
            if (matchingInp) directInputRole = matchingInp.role;
          }
        }
      }

      const cleanRole = outDef.label
        ? outDef.label.replace(/\s*\(LED\s*\d+\)/i, '').trim()
        : `OUT_${j}`;

      outputs.push({
        index: j,
        role: cleanRole,
        pin: sourcePin,
        directInputRole
      });
    }

    // Extract static tie-offs & internal inter-IC wires
    for (const w of refWires) {
      const isPowerA = w.from.startsWith('VCC') || w.from.startsWith('GND');
      const isPowerB = w.to.startsWith('VCC') || w.to.startsWith('GND');

      if (isPowerA && w.to.startsWith('IC_')) {
        const rail = w.from.startsWith('VCC') ? 'VCC' : 'GND';
        if (!this.isStandardPowerPin(w.to, exp)) {
          staticWiring.push({ pin: w.to, rail });
        }
      } else if (isPowerB && w.from.startsWith('IC_')) {
        const rail = w.to.startsWith('VCC') ? 'VCC' : 'GND';
        if (!this.isStandardPowerPin(w.from, exp)) {
          staticWiring.push({ pin: w.from, rail });
        }
      } else if (w.from.startsWith('IC_') && w.to.startsWith('IC_')) {
        internalWiring.push({ from: w.from, to: w.to });
      }
    }

    return { inputs, outputs, internalWiring, staticWiring };
  }

  isStandardPowerPin(pinNode, exp) {
    const match = pinNode.match(/^IC_(\d+)_P(\d+)$/);
    if (!match) return false;
    const socketId = parseInt(match[1], 10);
    const pinNum = parseInt(match[2], 10);

    const ds = (exp.defaultSockets || []).find(s => s.socketId === socketId);
    if (!ds) return false;

    const defs = typeof IC_DEFINITIONS !== 'undefined'
      ? IC_DEFINITIONS
      : (typeof require !== 'undefined' ? require('../ics/ic_definitions.js').IC_DEFINITIONS : null);

    if (defs && defs[ds.partNumber]) {
      const def = defs[ds.partNumber];
      return pinNum === def.vccPin || pinNum === def.gndPin;
    }
    return pinNum === 14 || pinNum === 7 || pinNum === 16 || pinNum === 8;
  }

  /**
   * Verify topology and discover input/output mappings.
   * @param {Object} experiment - Experiment definition
   * @param {NetlistEngine} engine - Circuit engine
   * @returns {Object} { passed, mapping, candidateMappings, errors, warnings, detail }
   */
  verify(experiment, engine) {
    const errors = [];
    const warnings = [];

    const { areConnected, getNet } = this.buildElectricalNets(engine);
    const topology = this.getTopology(experiment);

    // 1. Verify required ICs presence
    const installedICs = engine.sockets
      .filter(s => s.ic !== null)
      .map(s => s.ic.partNumber);

    for (const reqPart of (experiment.requiredICs || [])) {
      if (!installedICs.includes(reqPart)) {
        errors.push(`Missing required IC (${reqPart}) in socket.`);
      }
    }

    if (errors.length > 0) {
      return {
        passed: false,
        mapping: { inputs: {}, outputs: {}, inputSwitches: [], outputLeds: [] },
        candidateMappings: [],
        errors,
        warnings,
        detail: errors.join('; ')
      };
    }

    // 2. Verify static power tie-offs (e.g. Enable/Strobe pins)
    for (const sw of (topology.staticWiring || [])) {
      if (!areConnected(sw.pin, sw.rail)) {
        errors.push(`Required control/enable connection missing: Pin ${sw.pin} must be wired to ${sw.rail}.`);
      }
    }

    // 3. Verify internal IC-to-IC interconnections
    for (const iw of (topology.internalWiring || [])) {
      if (!areConnected(iw.from, iw.to)) {
        errors.push(`Required internal circuit interconnection between ${iw.from} and ${iw.to} is missing.`);
      }
    }

    // 4. Output Validation & Discovery
    const discoveredOutputs = {};
    const outputLeds = [];
    const outputNets = {};

    for (const outDef of (topology.outputs || [])) {
      if (outDef.directInputRole) {
        // Pass-through output (e.g. G3 = B3) resolved in pass-through phase
        continue;
      }

      if (!outDef.pin) {
        errors.push(`Logical output "${outDef.role}" has no designated output pin.`);
        continue;
      }

      const outPin = outDef.pin;
      const outNet = getNet(outPin);

      // Check power shorts on output
      if (areConnected(outPin, 'VCC')) {
        errors.push(`Logical output "${outDef.role}" (${outPin}) is shorted to VCC (+5V).`);
      }
      if (areConnected(outPin, 'GND')) {
        errors.push(`Logical output "${outDef.role}" (${outPin}) is shorted to GND.`);
      }

      // Check if shorted directly to a switch
      const switchesInNet = [...outNet].filter(n => n.startsWith('SW_'));
      if (switchesInNet.length > 0) {
        errors.push(`Logical output "${outDef.role}" (${outPin}) is shorted directly to switch (${switchesInNet.join(', ')}).`);
      }

      // Discover output LEDs
      const ledsInNet = [...outNet].filter(n => n.startsWith('LED_'));
      if (ledsInNet.length === 0) {
        errors.push(`Required logical output "${outDef.role}" is not connected to an output LED.`);
      } else {
        const ledName = ledsInNet[0];
        discoveredOutputs[outDef.role] = ledName;
        outputLeds[outDef.index] = parseInt(ledName.replace('LED_', ''), 10);
        outputNets[outDef.role] = outNet;
      }
    }

    // Check that distinct logical outputs are not shorted together
    const outputRoleKeys = Object.keys(outputNets);
    for (let i = 0; i < outputRoleKeys.length; i++) {
      for (let j = i + 1; j < outputRoleKeys.length; j++) {
        const rA = outputRoleKeys[i];
        const rB = outputRoleKeys[j];
        if (outputNets[rA] === outputNets[rB]) {
          errors.push(`Distinct logical outputs "${rA}" and "${rB}" are shorted together.`);
        }
        if (discoveredOutputs[rA] === discoveredOutputs[rB]) {
          errors.push(`Distinct logical outputs "${rA}" and "${rB}" are connected to the same LED (${discoveredOutputs[rA]}).`);
        }
      }
    }

    // 5. Input Validation & Discovery
    const discoveredInputs = {};
    const inputSwitches = [];
    const inputNets = {};

    for (const inDef of (topology.inputs || [])) {
      if (!inDef.pins || inDef.pins.length === 0) {
        if (!inDef.isPassThrough) {
          errors.push(`Logical input "${inDef.role}" has no designated input pins.`);
        }
        continue;
      }

      // Verify all branch pins for this logical input are connected together
      const firstPin = inDef.pins[0];
      for (let p = 1; p < inDef.pins.length; p++) {
        if (!areConnected(firstPin, inDef.pins[p])) {
          errors.push(`Required branches for input "${inDef.role}" (${firstPin} and ${inDef.pins[p]}) are not connected together.`);
        }
      }

      const inNet = getNet(firstPin);

      // Check power rail tie-off
      if (inNet.has('VCC') || inNet.has('GND') || areConnected(firstPin, 'VCC') || areConnected(firstPin, 'GND')) {
        errors.push(`Input "${inDef.role}" is tied directly to a power rail instead of a control switch.`);
      }

      // Check bypass: switch connected directly to LED without passing through required IC logic
      const ledsInNet = [...inNet].filter(n => n.startsWith('LED_'));
      if (ledsInNet.length > 0 && !inDef.isPassThrough) {
        errors.push(`Direct switch-to-LED bypass detected on input "${inDef.role}" without passing through required IC logic.`);
      }

      // Discover connected switches
      const switchesInNet = [...inNet].filter(n => n.startsWith('SW_'));
      if (switchesInNet.length === 0) {
        errors.push(`Input "${inDef.role}" is not connected to any control switch.`);
      } else if (switchesInNet.length > 1) {
        errors.push(`Multiple switches (${switchesInNet.join(', ')}) are shorted together on input "${inDef.role}".`);
      } else {
        const swName = switchesInNet[0];
        discoveredInputs[inDef.role] = swName;
        inputSwitches[inDef.index] = parseInt(swName.replace('SW_', ''), 10);
        inputNets[inDef.role] = inNet;
      }
    }

    // Check that distinct logical inputs are not shorted together
    const inputRoleKeys = Object.keys(inputNets);
    for (let i = 0; i < inputRoleKeys.length; i++) {
      for (let j = i + 1; j < inputRoleKeys.length; j++) {
        const rA = inputRoleKeys[i];
        const rB = inputRoleKeys[j];
        if (inputNets[rA] === inputNets[rB]) {
          errors.push(`Inputs "${rA}" and "${rB}" are shorted together.`);
        }
        if (discoveredInputs[rA] === discoveredInputs[rB]) {
          errors.push(`Inputs "${rA}" and "${rB}" are connected to the same switch (${discoveredInputs[rA]}).`);
        }
      }
    }

    // 6. Handle Pass-Through Outputs (e.g. Exp 2 G3 = B3)
    for (const outDef of (topology.outputs || [])) {
      if (outDef.directInputRole) {
        const swName = discoveredInputs[outDef.directInputRole];
        if (swName) {
          const swNet = getNet(swName);
          const ledsInNet = [...swNet].filter(n => n.startsWith('LED_'));
          if (ledsInNet.length === 0) {
            errors.push(`Pass-through output "${outDef.role}" is not connected to an output LED.`);
          } else {
            const ledName = ledsInNet[0];
            discoveredOutputs[outDef.role] = ledName;
            outputLeds[outDef.index] = parseInt(ledName.replace('LED_', ''), 10);
            outputNets[outDef.role] = swNet;
          }
        } else {
          errors.push(`Pass-through output "${outDef.role}" could not resolve because input "${outDef.directInputRole}" has no switch.`);
        }
      }
    }

    // Check for any floating required IC pins or incorrect pin wiring
    for (const inDef of (topology.inputs || [])) {
      for (const pin of inDef.pins || []) {
        const pinNet = getNet(pin);
        const hasSwitch = [...pinNet].some(n => n.startsWith('SW_'));
        if (!hasSwitch && !errors.some(e => e.includes(inDef.role))) {
          errors.push(`Required IC pin ${pin} for input "${inDef.role}" is not connected to any switch.`);
        }
      }
    }

    const passed = errors.length === 0;

    // Generate candidate mappings if commutative inputs exist
    const candidateMappings = [];
    const baseMapping = {
      inputs: discoveredInputs,
      outputs: discoveredOutputs,
      inputSwitches: [...inputSwitches],
      outputLeds: [...outputLeds]
    };

    if (passed) {
      candidateMappings.push(baseMapping);

      // Check if any commutative pairs exist (e.g. A and B in 2-input gates)
      for (const inDef of (topology.inputs || [])) {
        for (const commRole of (inDef.commutativeWith || [])) {
          const otherInDef = (topology.inputs || []).find(inp => inp.role === commRole);
          if (otherInDef && inDef.index < otherInDef.index) {
            // Generate swapped permutation
            const swappedSwitches = [...inputSwitches];
            const temp = swappedSwitches[inDef.index];
            swappedSwitches[inDef.index] = swappedSwitches[otherInDef.index];
            swappedSwitches[otherInDef.index] = temp;

            const swappedInputs = { ...discoveredInputs };
            swappedInputs[inDef.role] = discoveredInputs[otherInDef.role];
            swappedInputs[otherInDef.role] = discoveredInputs[inDef.role];

            candidateMappings.push({
              inputs: swappedInputs,
              outputs: discoveredOutputs,
              inputSwitches: swappedSwitches,
              outputLeds: [...outputLeds]
            });
          }
        }
      }
    }

    const inputListStr = Object.entries(discoveredInputs).map(([r, s]) => `${r}: ${s}`).join(', ');
    const outputListStr = Object.entries(discoveredOutputs).map(([r, l]) => `${r}: ${l}`).join(', ');
    const detail = passed
      ? `Circuit topology detected: Inputs [${inputListStr}] → Outputs [${outputListStr}]`
      : errors.join('; ');

    return {
      passed,
      mapping: baseMapping,
      candidateMappings,
      errors,
      warnings,
      detail
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TopologyVerifier };
}
