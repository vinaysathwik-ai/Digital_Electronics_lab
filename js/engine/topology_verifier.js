/**
 * Circuit Topology and Role Verifier
 * Validates logical circuit structure independently of physical switch/LED positions,
 * socket locations, and gate slots within multi-gate ICs.
 * 
 * Separates logical roles (e.g. A, B, Y, Sum, Carry) from physical components (SW4, SW7, LED5, Socket 2, Gate Slot 3).
 * Enforces strict topological integrity (no bridges, no shorts, no bypasses, valid IC pin routing).
 * Produces student-safe diagnostic error messages (free of raw node/pin names or reference indices).
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

    // Tie VCC and GND distribution rails together
    for (let i = 0; i < 8; i++) {
      union('VCC', `VCC_${i}`);
      union('GND', `GND_${i}`);
    }

    // Apply student wires
    for (const w of engine.wires) {
      union(w.from, w.to);
    }

    // Map each root to its set of connected node terminals
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
   * Derive logical topology from experiment definition or reference wiring.
   * @param {Object} exp - Experiment definition
   * @returns {Object} Normalized logical topology
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

      inputs.push({
        index: i,
        role: cleanRole,
        pins: targetPins,
        isPassThrough
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
   * Derive commutative / interchangeable input groups from truth table symmetry.
   * Two input indices are interchangeable if swapping them produces identical outputs
   * for every row in the truth table.
   * @param {Object} exp
   * @returns {Array<Array<number>>} Groups of interchangeable input indices
   */
  getCommutativeGroups(exp) {
    if (exp.commutativeInputs) {
      return exp.commutativeInputs.map(group => {
        return group.map(item => {
          if (typeof item === 'number') return item;
          const idx = (exp.inputs || []).findIndex(inp => inp.label && inp.label.includes(item));
          return idx >= 0 ? idx : 0;
        });
      });
    }

    if (!exp.truthTable || !exp.truthTable.rows || exp.truthTable.rows.length === 0) {
      return [];
    }

    const rows = exp.truthTable.rows;
    const numInputs = (exp.inputs || []).length;
    if (numInputs < 2) return [];

    const parent = [];
    for (let i = 0; i < numInputs; i++) parent[i] = i;
    function find(i) {
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    }
    function union(i, j) {
      const rA = find(i);
      const rB = find(j);
      if (rA !== rB) parent[rA] = rB;
    }

    for (let i = 0; i < numInputs; i++) {
      for (let j = i + 1; j < numInputs; j++) {
        let interchangeable = true;
        for (const r of rows) {
          const swapped = [...r.inputs];
          swapped[i] = r.inputs[j];
          swapped[j] = r.inputs[i];

          const matchRow = rows.find(r2 => 
            r2.inputs.length === swapped.length &&
            r2.inputs.every((val, idx) => val === swapped[idx])
          );

          if (!matchRow) {
            interchangeable = false;
            break;
          }

          for (let k = 0; k < r.outputs.length; k++) {
            if (matchRow.outputs[k] !== r.outputs[k]) {
              interchangeable = false;
              break;
            }
          }
          if (!interchangeable) break;
        }

        if (interchangeable) {
          union(i, j);
        }
      }
    }

    const groupMap = new Map();
    for (let i = 0; i < numInputs; i++) {
      const root = find(i);
      if (!groupMap.has(root)) groupMap.set(root, []);
      groupMap.get(root).push(i);
    }

    const result = [];
    for (const members of groupMap.values()) {
      if (members.length > 1) {
        result.push(members);
      }
    }
    return result;
  }

  /**
   * Helper to generate all permutations of an array.
   */
  permute(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      const remainingPerms = this.permute(remaining);
      for (const p of remainingPerms) {
        result.push([current, ...p]);
      }
    }
    return result;
  }

  /**
   * Helper to compute Cartesian product of arrays.
   */
  cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => {
      const res = [];
      for (const a of acc) {
        for (const c of curr) {
          res.push([...a, c]);
        }
      }
      return res;
    }, [[]]);
  }

  /**
   * Generate candidate socket assignments from reference logical sockets to actual sockets.
   * Matches by required partNumber.
   * @param {Object} exp
   * @param {NetlistEngine} engine
   * @returns {Array<Object>} List of maps { [refSocketId]: actualSocketId }
   */
  generateSocketAssignments(exp, engine) {
    const refSockets = exp.defaultSockets && exp.defaultSockets.length > 0
      ? exp.defaultSockets
      : (exp.requiredICs || []).map((part, idx) => ({ socketId: idx, partNumber: part }));

    const installed = [];
    for (let s = 0; s < engine.sockets.length; s++) {
      const sock = engine.sockets[s];
      if (sock && sock.ic) {
        installed.push({ socketId: s, partNumber: sock.ic.partNumber });
      }
    }

    const assignments = [];

    function search(refIdx, currentMap, usedActualSockets) {
      if (refIdx >= refSockets.length) {
        assignments.push({ ...currentMap });
        return;
      }

      const refSock = refSockets[refIdx];
      const matchingInstalled = installed.filter(inst => 
        !usedActualSockets.has(inst.socketId) && inst.partNumber === refSock.partNumber
      );

      for (const inst of matchingInstalled) {
        currentMap[refSock.socketId] = inst.socketId;
        usedActualSockets.add(inst.socketId);
        search(refIdx + 1, currentMap, usedActualSockets);
        usedActualSockets.delete(inst.socketId);
        delete currentMap[refSock.socketId];
      }
    }

    search(0, {}, new Set());
    return assignments;
  }

  /**
   * Generate candidate gate slot assignments for a given socket assignment.
   * If strictGateSlots is enabled, only identity mapping is used.
   * @param {Object} exp
   * @param {Object} topology
   * @param {Object} socketMap
   * @param {NetlistEngine} engine
   * @returns {Array<Object>} List of gateMaps { [refSocketId]: { [refGateId]: candGateId } }
   */
  generateGateSlotAssignments(exp, topology, socketMap, engine) {
    if (exp.strictGateSlots) {
      return [{}];
    }

    const defs = typeof IC_DEFINITIONS !== 'undefined'
      ? IC_DEFINITIONS
      : (typeof require !== 'undefined' ? require('../ics/ic_definitions.js').IC_DEFINITIONS : null);

    if (!defs) return [{}];

    const refSockets = exp.defaultSockets && exp.defaultSockets.length > 0
      ? exp.defaultSockets
      : (exp.requiredICs || []).map((part, idx) => ({ socketId: idx, partNumber: part }));

    // Find nodes wired in engine to prune unused gates
    const wiredNodes = new Set();
    for (const w of engine.wires) {
      if (w.from) wiredNodes.add(w.from);
      if (w.to) wiredNodes.add(w.to);
    }

    const icGateOptions = [];

    for (const refSock of refSockets) {
      const refId = refSock.socketId;
      const actualId = socketMap[refId];
      const partNumber = refSock.partNumber;
      const def = defs[partNumber];

      if (!def || !def.gates || def.gates.length === 0) {
        icGateOptions.push([{ refSocketId: refId, map: {} }]);
        continue;
      }

      // Collect all reference pins used on this IC
      const usedPinsOnIC = new Set();
      for (const inp of (topology.inputs || [])) {
        for (const p of inp.pins || []) {
          const match = p.match(new RegExp(`^IC_${refId}_P(\\d+)$`));
          if (match) usedPinsOnIC.add(parseInt(match[1], 10));
        }
      }
      for (const out of (topology.outputs || [])) {
        if (out.pin) {
          const match = out.pin.match(new RegExp(`^IC_${refId}_P(\\d+)$`));
          if (match) usedPinsOnIC.add(parseInt(match[1], 10));
        }
      }
      for (const iw of (topology.internalWiring || [])) {
        const mA = iw.from.match(new RegExp(`^IC_${refId}_P(\\d+)$`));
        if (mA) usedPinsOnIC.add(parseInt(mA[1], 10));
        const mB = iw.to.match(new RegExp(`^IC_${refId}_P(\\d+)$`));
        if (mB) usedPinsOnIC.add(parseInt(mB[1], 10));
      }
      for (const sw of (topology.staticWiring || [])) {
        const match = sw.pin.match(new RegExp(`^IC_${refId}_P(\\d+)$`));
        if (match) usedPinsOnIC.add(parseInt(match[1], 10));
      }

      // Identify which gates are used in reference
      const usedRefGateIds = [];
      for (const g of def.gates) {
        const usesThisGate = g.inputs.some(p => usedPinsOnIC.has(p)) || usedPinsOnIC.has(g.output);
        if (usesThisGate) {
          usedRefGateIds.push(g.id);
        }
      }

      if (usedRefGateIds.length === 0) {
        icGateOptions.push([{ refSocketId: refId, map: {} }]);
        continue;
      }

      // Candidate gates on actual socket: only gates where at least one pin has student wires
      // (or include all gates if none wired to avoid false empty set)
      let candidateGates = def.gates.filter(g => {
        const outNode = `IC_${actualId}_P${g.output}`;
        const hasOut = wiredNodes.has(outNode);
        const hasIn = g.inputs.some(p => wiredNodes.has(`IC_${actualId}_P${p}`));
        return hasOut || hasIn;
      });

      if (candidateGates.length < usedRefGateIds.length) {
        candidateGates = [...def.gates];
      }

      // Generate all injections from usedRefGateIds to candidateGates
      const gatePermutations = [];
      const candGateIds = candidateGates.map(g => g.id);

      function pickGates(refIdx, currentMap, usedCandIds) {
        if (refIdx >= usedRefGateIds.length) {
          gatePermutations.push({ refSocketId: refId, map: { ...currentMap } });
          return;
        }
        const refGId = usedRefGateIds[refIdx];
        for (const cId of candGateIds) {
          if (!usedCandIds.has(cId)) {
            currentMap[refGId] = cId;
            usedCandIds.add(cId);
            pickGates(refIdx + 1, currentMap, usedCandIds);
            usedCandIds.delete(cId);
            delete currentMap[refGId];
          }
        }
      }

      pickGates(0, {}, new Set());
      icGateOptions.push(gatePermutations.length > 0 ? gatePermutations : [{ refSocketId: refId, map: {} }]);
    }

    const combinations = this.cartesianProduct(icGateOptions);
    return combinations.map(combo => {
      const merged = {};
      for (const item of combo) {
        merged[item.refSocketId] = item.map;
      }
      return merged;
    });
  }

  /**
   * Translate a pin node using socket mapping and gate mapping.
   */
  translateNode(nodeStr, socketMap, gateMap, exp) {
    const match = nodeStr.match(/^IC_(\d+)_P(\d+)$/);
    if (!match) return nodeStr;

    const refSock = parseInt(match[1], 10);
    const pin = parseInt(match[2], 10);
    const actualSock = socketMap[refSock];
    if (actualSock === undefined) return nodeStr;

    const defs = typeof IC_DEFINITIONS !== 'undefined'
      ? IC_DEFINITIONS
      : (typeof require !== 'undefined' ? require('../ics/ic_definitions.js').IC_DEFINITIONS : null);

    const refSockets = exp.defaultSockets && exp.defaultSockets.length > 0
      ? exp.defaultSockets
      : (exp.requiredICs || []).map((part, idx) => ({ socketId: idx, partNumber: part }));

    const refSockDef = refSockets.find(s => s.socketId === refSock);
    if (!refSockDef || !defs || !defs[refSockDef.partNumber]) {
      return `IC_${actualSock}_P${pin}`;
    }

    const def = defs[refSockDef.partNumber];
    if (!def.gates || def.gates.length === 0 || !gateMap || !gateMap[refSock]) {
      return `IC_${actualSock}_P${pin}`;
    }

    // Find which gate in def contains this pin
    const refGate = def.gates.find(g => g.inputs.includes(pin) || g.output === pin);
    if (!refGate) {
      return `IC_${actualSock}_P${pin}`;
    }

    const targetGateId = gateMap[refSock][refGate.id];
    if (targetGateId === undefined) {
      return `IC_${actualSock}_P${pin}`;
    }

    const targetGate = def.gates.find(g => g.id === targetGateId);
    if (!targetGate) {
      return `IC_${actualSock}_P${pin}`;
    }

    if (pin === refGate.output) {
      return `IC_${actualSock}_P${targetGate.output}`;
    } else {
      const inIdx = refGate.inputs.indexOf(pin);
      const targetPin = targetGate.inputs[inIdx];
      return `IC_${actualSock}_P${targetPin}`;
    }
  }

  /**
   * Check for direct switch-to-LED bypasses in the student's wiring.
   * If a switch connects directly to an LED without an authorized pass-through, it's flagged.
   */
  detectExplicitBypass(engine, topology, getNet) {
    const passThroughPairs = new Set();
    for (const outDef of (topology.outputs || [])) {
      if (outDef.directInputRole) {
        passThroughPairs.add(outDef.directInputRole);
      }
    }

    for (let sw = 0; sw < 8; sw++) {
      const swNode = `SW_${sw}`;
      const net = getNet(swNode);
      const ledsInNet = [...net].filter(n => n.startsWith('LED_'));
      if (ledsInNet.length > 0) {
        // Check if there are any IC pins in this net
        const icPinsInNet = [...net].filter(n => n.startsWith('IC_'));
        if (icPinsInNet.length === 0 && passThroughPairs.size === 0) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Verify topology and discover input/output mappings.
   * @param {Object} experiment - Experiment definition
   * @param {NetlistEngine} engine - Circuit engine
   * @param {Object} options - { debug: boolean }
   * @returns {Object} { passed, mapping, candidateMappings, errors, debug, warnings, detail }
   */
  verify(experiment, engine, options = {}) {
    const { areConnected, getNet } = this.buildElectricalNets(engine);
    const topology = this.getTopology(experiment);

    // 1. Verify required ICs are present anywhere on board
    const installedICs = engine.sockets
      .filter(s => s.ic !== null)
      .map(s => s.ic.partNumber);

    const missingICs = [];
    for (const reqPart of (experiment.requiredICs || [])) {
      if (!installedICs.includes(reqPart)) {
        missingICs.push(reqPart);
      }
    }

    if (missingICs.length > 0) {
      const studentError = `Missing required IC (${missingICs.join(', ')}) in socket.`;
      return {
        passed: false,
        mapping: { inputs: {}, outputs: {}, inputSwitches: [], outputLeds: [] },
        candidateMappings: [],
        errors: [studentError],
        debug: [`Installed ICs: [${installedICs.join(', ')}]. Missing: [${missingICs.join(', ')}]`],
        warnings: [],
        detail: studentError
      };
    }

    // 2. Check for explicit switch-to-LED bypass
    if (this.detectExplicitBypass(engine, topology, getNet)) {
      const bypassMsg = 'Direct switch-to-LED bypass detected: a switch is connected directly to an LED without passing through required IC logic.';
      return {
        passed: false,
        mapping: { inputs: {}, outputs: {}, inputSwitches: [], outputLeds: [] },
        candidateMappings: [],
        errors: [bypassMsg],
        debug: ['Direct wire connection from switch to LED bypassing IC logic detected.'],
        warnings: [],
        detail: bypassMsg
      };
    }

    // 3. Generate candidate socket assignments
    const socketAssignments = this.generateSocketAssignments(experiment, engine);
    if (socketAssignments.length === 0) {
      const errorMsg = 'Required ICs are installed, but socket configuration could not be resolved.';
      return {
        passed: false,
        mapping: { inputs: {}, outputs: {}, inputSwitches: [], outputLeds: [] },
        candidateMappings: [],
        errors: [errorMsg],
        debug: ['No valid bijection between reference logical sockets and installed IC sockets.'],
        warnings: [],
        detail: errorMsg
      };
    }

    // 4. Try candidate configurations (Socket assignment + Gate slot assignment)
    let bestResult = null;
    let minErrorCount = Infinity;

    for (const socketMap of socketAssignments) {
      const gateSlotAssignments = this.generateGateSlotAssignments(experiment, topology, socketMap, engine);

      for (const gateMap of gateSlotAssignments) {
        const evaluation = this.evaluateConfiguration(
          experiment,
          topology,
          socketMap,
          gateMap,
          engine,
          areConnected,
          getNet
        );

        if (evaluation.passed) {
          // Success! Found a valid topology
          return evaluation;
        }

        if (evaluation.errors.length < minErrorCount) {
          minErrorCount = evaluation.errors.length;
          bestResult = evaluation;
        }
      }
    }

    return bestResult || {
      passed: false,
      mapping: { inputs: {}, outputs: {}, inputSwitches: [], outputLeds: [] },
      candidateMappings: [],
      errors: ['Circuit topology check failed.'],
      debug: ['No configuration passed topology evaluation.'],
      warnings: [],
      detail: 'Circuit topology check failed.'
    };
  }

  /**
   * Evaluate a specific (socketMap, gateMap) configuration against electrical nets.
   */
  evaluateConfiguration(experiment, topology, socketMap, gateMap, engine, areConnected, getNet) {
    const errors = [];
    const debug = [];
    const warnings = [];

    const translate = (node) => this.translateNode(node, socketMap, gateMap, experiment);

    // 1. Static power / enable tie-offs
    for (const sw of (topology.staticWiring || [])) {
      const translatedPin = translate(sw.pin);
      if (!areConnected(translatedPin, sw.rail)) {
        errors.push(`A required control pin is not tied to the correct rail (${sw.rail}).`);
        debug.push(`Control pin ${translatedPin} is not tied to ${sw.rail}.`);
      }
    }

    // 2. Internal inter-IC wires
    for (const iw of (topology.internalWiring || [])) {
      const tFrom = translate(iw.from);
      const tTo = translate(iw.to);
      if (!areConnected(tFrom, tTo)) {
        errors.push('A required connection between ICs is missing.');
        debug.push(`Internal connection between ${tFrom} and ${tTo} is missing.`);
      }
    }

    // 3. Output Validation & Discovery
    const discoveredOutputs = {};
    const outputLeds = [];
    const outputNets = {};

    for (const outDef of (topology.outputs || [])) {
      if (outDef.directInputRole) {
        continue; // Handled in pass-through phase
      }

      if (!outDef.pin) {
        errors.push(`Logical output "${outDef.role}" has no designated output pin.`);
        debug.push(`Output ${outDef.role} missing pin.`);
        continue;
      }

      const outPin = translate(outDef.pin);
      const outNet = getNet(outPin);

      // Power shorts on output
      if (areConnected(outPin, 'VCC')) {
        errors.push(`Logical output "${outDef.role}" is shorted to VCC (+5V).`);
        debug.push(`Output ${outDef.role} (${outPin}) is connected to VCC.`);
      }
      if (areConnected(outPin, 'GND')) {
        errors.push(`Logical output "${outDef.role}" is shorted to GND.`);
        debug.push(`Output ${outDef.role} (${outPin}) is connected to GND.`);
      }

      // Shorted directly to a switch
      const switchesInNet = [...outNet].filter(n => n.startsWith('SW_'));
      if (switchesInNet.length > 0) {
        errors.push(`Logical output "${outDef.role}" is shorted directly to a control switch.`);
        debug.push(`Output ${outDef.role} (${outPin}) shorted to switches: ${switchesInNet.join(', ')}.`);
      }

      // Discover output LEDs
      const ledsInNet = [...outNet].filter(n => n.startsWith('LED_'));
      if (ledsInNet.length === 0) {
        errors.push(`Required logical output "${outDef.role}" is not connected to an output LED.`);
        debug.push(`No LED found in net of output ${outDef.role} (${outPin}).`);
      } else {
        const ledName = ledsInNet[0];
        discoveredOutputs[outDef.role] = ledName;
        outputLeds[outDef.index] = parseInt(ledName.replace('LED_', ''), 10);
        outputNets[outDef.role] = outNet;
      }
    }

    // Check distinct logical outputs not shorted together
    const outputRoleKeys = Object.keys(outputNets);
    for (let i = 0; i < outputRoleKeys.length; i++) {
      for (let j = i + 1; j < outputRoleKeys.length; j++) {
        const rA = outputRoleKeys[i];
        const rB = outputRoleKeys[j];
        if (outputNets[rA] === outputNets[rB]) {
          errors.push(`Distinct logical outputs "${rA}" and "${rB}" are shorted together.`);
          debug.push(`Outputs ${rA} and ${rB} share electrical net.`);
        }
        if (discoveredOutputs[rA] === discoveredOutputs[rB]) {
          errors.push(`Distinct logical outputs "${rA}" and "${rB}" are connected to the same LED.`);
          debug.push(`Outputs ${rA} and ${rB} both connect to ${discoveredOutputs[rA]}.`);
        }
      }
    }

    // 4. Input Validation & Discovery
    const discoveredInputs = {};
    const inputSwitches = [];
    const inputNets = {};

    for (const inDef of (topology.inputs || [])) {
      if (!inDef.pins || inDef.pins.length === 0) {
        if (!inDef.isPassThrough) {
          errors.push(`Logical input "${inDef.role}" has no designated input pins.`);
          debug.push(`Input ${inDef.role} has no pins.`);
        }
        continue;
      }

      const translatedPins = inDef.pins.map(translate);
      const firstPin = translatedPins[0];

      // Verify all branch pins for this logical input are connected together
      for (let p = 1; p < translatedPins.length; p++) {
        if (!areConnected(firstPin, translatedPins[p])) {
          errors.push(`Required branches for input "${inDef.role}" are not connected together.`);
          debug.push(`Branches ${firstPin} and ${translatedPins[p]} for input ${inDef.role} are disconnected.`);
        }
      }

      const inNet = getNet(firstPin);

      // Power rail tie-off check
      if (inNet.has('VCC') || inNet.has('GND') || areConnected(firstPin, 'VCC') || areConnected(firstPin, 'GND')) {
        errors.push(`Input "${inDef.role}" is tied directly to a power rail instead of a control switch.`);
        debug.push(`Input ${inDef.role} (${firstPin}) tied to power rail.`);
      }

      // Check direct switch-to-LED bypass on this input
      const ledsInNet = [...inNet].filter(n => n.startsWith('LED_'));
      if (ledsInNet.length > 0 && !inDef.isPassThrough) {
        errors.push(`Direct switch-to-LED bypass detected on input "${inDef.role}" without passing through required IC logic.`);
        debug.push(`Input ${inDef.role} (${firstPin}) connects directly to LED(s): ${ledsInNet.join(', ')}.`);
      }

      // Discover connected switches
      const switchesInNet = [...inNet].filter(n => n.startsWith('SW_'));
      if (switchesInNet.length === 0) {
        errors.push(`Input "${inDef.role}" is not connected to any control switch.`);
        debug.push(`Input ${inDef.role} (${firstPin}) has no switch.`);
      } else if (switchesInNet.length > 1) {
        errors.push(`Multiple control switches are shorted together on input "${inDef.role}".`);
        debug.push(`Input ${inDef.role} has multiple switches shorted: ${switchesInNet.join(', ')}.`);
      } else {
        const swName = switchesInNet[0];
        discoveredInputs[inDef.role] = swName;
        inputSwitches[inDef.index] = parseInt(swName.replace('SW_', ''), 10);
        inputNets[inDef.role] = inNet;
      }
    }

    // Check distinct logical inputs not shorted together
    const inputRoleKeys = Object.keys(inputNets);
    for (let i = 0; i < inputRoleKeys.length; i++) {
      for (let j = i + 1; j < inputRoleKeys.length; j++) {
        const rA = inputRoleKeys[i];
        const rB = inputRoleKeys[j];
        if (inputNets[rA] === inputNets[rB]) {
          errors.push(`Inputs "${rA}" and "${rB}" are shorted together.`);
          debug.push(`Inputs ${rA} and ${rB} share electrical net.`);
        }
        if (discoveredInputs[rA] === discoveredInputs[rB]) {
          errors.push(`Inputs "${rA}" and "${rB}" are connected to the same control switch.`);
          debug.push(`Inputs ${rA} and ${rB} both connect to ${discoveredInputs[rA]}.`);
        }
      }
    }

    // 5. Handle Pass-Through Outputs (e.g. Exp 2 G3 = B3)
    for (const outDef of (topology.outputs || [])) {
      if (outDef.directInputRole) {
        const swName = discoveredInputs[outDef.directInputRole];
        if (swName) {
          const swNet = getNet(swName);
          const ledsInNet = [...swNet].filter(n => n.startsWith('LED_'));
          if (ledsInNet.length === 0) {
            errors.push(`Pass-through output "${outDef.role}" is not connected to an output LED.`);
            debug.push(`Pass-through output ${outDef.role} (${swName}) has no LED.`);
          } else {
            const ledName = ledsInNet[0];
            discoveredOutputs[outDef.role] = ledName;
            outputLeds[outDef.index] = parseInt(ledName.replace('LED_', ''), 10);
            outputNets[outDef.role] = swNet;
          }
        } else {
          errors.push(`Pass-through output "${outDef.role}" could not resolve because input "${outDef.directInputRole}" has no switch.`);
          debug.push(`Pass-through input ${outDef.directInputRole} not found.`);
        }
      }
    }

    // 6. Check for floating required IC pins
    for (const inDef of (topology.inputs || [])) {
      for (const pin of inDef.pins || []) {
        const translatedPin = translate(pin);
        const pinNet = getNet(translatedPin);
        const hasSwitch = [...pinNet].some(n => n.startsWith('SW_'));
        if (!hasSwitch && !errors.some(e => e.includes(inDef.role))) {
          errors.push(`Input "${inDef.role}" is missing a required switch connection to the IC.`);
          debug.push(`IC pin ${translatedPin} for input ${inDef.role} has no switch.`);
        }
      }
    }

    const passed = errors.length === 0;

    // Generate candidate mappings from automatically derived commutative symmetry groups
    const baseMapping = {
      inputs: discoveredInputs,
      outputs: discoveredOutputs,
      inputSwitches: [...inputSwitches],
      outputLeds: [...outputLeds]
    };

    const candidateMappings = [];
    if (passed) {
      const commutativeGroups = this.getCommutativeGroups(experiment);
      if (commutativeGroups.length === 0) {
        candidateMappings.push(baseMapping);
      } else {
        // Generate permutations for each group
        const groupPermutations = commutativeGroups.map(group => this.permute(group));
        const allGroupCombos = this.cartesianProduct(groupPermutations);

        for (const combo of allGroupCombos) {
          const permutedSwitches = [...inputSwitches];
          const permutedInputs = { ...discoveredInputs };

          for (let g = 0; g < commutativeGroups.length; g++) {
            const origGroup = commutativeGroups[g];
            const permGroup = combo[g];
            for (let idx = 0; idx < origGroup.length; idx++) {
              const origInIdx = origGroup[idx];
              const permInIdx = permGroup[idx];
              permutedSwitches[origInIdx] = inputSwitches[permInIdx];

              const origRole = experiment.inputs[origInIdx].label.replace(/\s*\(SW\s*\d+\)/i, '').trim();
              const permRole = experiment.inputs[permInIdx].label.replace(/\s*\(SW\s*\d+\)/i, '').trim();
              permutedInputs[origRole] = discoveredInputs[permRole];
            }
          }

          candidateMappings.push({
            inputs: permutedInputs,
            outputs: discoveredOutputs,
            inputSwitches: permutedSwitches,
            outputLeds: [...outputLeds]
          });
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
      debug,
      warnings,
      detail
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TopologyVerifier };
}
