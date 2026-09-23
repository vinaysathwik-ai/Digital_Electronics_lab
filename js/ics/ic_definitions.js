/**
 * IC Library with accurate pinouts and functional simulation matching
 * SRM Digital Electronics Observation Book (ECE 211 / CSE 207) Appendix-I
 */

const IC_DEFINITIONS = {
  '7408': {
    partNumber: '7408',
    name: 'Quad 2-Input AND Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input positive-AND gates. Y = A · B',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      4: { name: '2A', type: 'input', group: 2, role: 'A' },
      5: { name: '2B', type: 'input', group: 2, role: 'B' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3A', type: 'input', group: 3, role: 'A' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      12: { name: '4A', type: 'input', group: 4, role: 'A' },
      13: { name: '4B', type: 'input', group: 4, role: 'B' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2], output: 3, eval: (a, b) => (a === 1 && b === 1 ? 1 : 0) },
      { id: 2, inputs: [4, 5], output: 6, eval: (a, b) => (a === 1 && b === 1 ? 1 : 0) },
      { id: 3, inputs: [9, 10], output: 8, eval: (a, b) => (a === 1 && b === 1 ? 1 : 0) },
      { id: 4, inputs: [12, 13], output: 11, eval: (a, b) => (a === 1 && b === 1 ? 1 : 0) }
    ]
  },

  '7432': {
    partNumber: '7432',
    name: 'Quad 2-Input OR Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input positive-OR gates. Y = A + B',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      4: { name: '2A', type: 'input', group: 2, role: 'A' },
      5: { name: '2B', type: 'input', group: 2, role: 'B' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3A', type: 'input', group: 3, role: 'A' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      12: { name: '4A', type: 'input', group: 4, role: 'A' },
      13: { name: '4B', type: 'input', group: 4, role: 'B' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2], output: 3, eval: (a, b) => (a === 1 || b === 1 ? 1 : 0) },
      { id: 2, inputs: [4, 5], output: 6, eval: (a, b) => (a === 1 || b === 1 ? 1 : 0) },
      { id: 3, inputs: [9, 10], output: 8, eval: (a, b) => (a === 1 || b === 1 ? 1 : 0) },
      { id: 4, inputs: [12, 13], output: 11, eval: (a, b) => (a === 1 || b === 1 ? 1 : 0) }
    ]
  },

  '7404': {
    partNumber: '7404',
    name: 'Hex Inverter (NOT)',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Six independent inverters. Y = A̅',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      3: { name: '2A', type: 'input', group: 2, role: 'A' },
      4: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      5: { name: '3A', type: 'input', group: 3, role: 'A' },
      6: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      9: { name: '4A', type: 'input', group: 4, role: 'A' },
      10: { name: '5Y', type: 'output', group: 5, role: 'Y' },
      11: { name: '5A', type: 'input', group: 5, role: 'A' },
      12: { name: '6Y', type: 'output', group: 6, role: 'Y' },
      13: { name: '6A', type: 'input', group: 6, role: 'A' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1], output: 2, eval: (a) => (a === 1 ? 0 : 1) },
      { id: 2, inputs: [3], output: 4, eval: (a) => (a === 1 ? 0 : 1) },
      { id: 3, inputs: [5], output: 6, eval: (a) => (a === 1 ? 0 : 1) },
      { id: 4, inputs: [9], output: 8, eval: (a) => (a === 1 ? 0 : 1) },
      { id: 5, inputs: [11], output: 10, eval: (a) => (a === 1 ? 0 : 1) },
      { id: 6, inputs: [13], output: 12, eval: (a) => (a === 1 ? 0 : 1) }
    ]
  },

  '7400': {
    partNumber: '7400',
    name: 'Quad 2-Input NAND Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input positive-NAND gates. Y = (A · B)̅',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      4: { name: '2A', type: 'input', group: 2, role: 'A' },
      5: { name: '2B', type: 'input', group: 2, role: 'B' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3A', type: 'input', group: 3, role: 'A' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      12: { name: '4A', type: 'input', group: 4, role: 'A' },
      13: { name: '4B', type: 'input', group: 4, role: 'B' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2], output: 3, eval: (a, b) => (a === 1 && b === 1 ? 0 : 1) },
      { id: 2, inputs: [4, 5], output: 6, eval: (a, b) => (a === 1 && b === 1 ? 0 : 1) },
      { id: 3, inputs: [9, 10], output: 8, eval: (a, b) => (a === 1 && b === 1 ? 0 : 1) },
      { id: 4, inputs: [12, 13], output: 11, eval: (a, b) => (a === 1 && b === 1 ? 0 : 1) }
    ]
  },

  '7402': {
    partNumber: '7402',
    name: 'Quad 2-Input NOR Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input NOR gates. Note inverted pinout: Output on pin 1, 4, 10, 13. Y = (A + B)̅',
    pins: {
      1: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      2: { name: '1A', type: 'input', group: 1, role: 'A' },
      3: { name: '1B', type: 'input', group: 1, role: 'B' },
      4: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      5: { name: '2A', type: 'input', group: 2, role: 'A' },
      6: { name: '2B', type: 'input', group: 2, role: 'B' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3A', type: 'input', group: 3, role: 'A' },
      9: { name: '3B', type: 'input', group: 3, role: 'B' },
      10: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      11: { name: '4A', type: 'input', group: 4, role: 'A' },
      12: { name: '4B', type: 'input', group: 4, role: 'B' },
      13: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [2, 3], output: 1, eval: (a, b) => (a === 0 && b === 0 ? 1 : 0) },
      { id: 2, inputs: [5, 6], output: 4, eval: (a, b) => (a === 0 && b === 0 ? 1 : 0) },
      { id: 3, inputs: [8, 9], output: 10, eval: (a, b) => (a === 0 && b === 0 ? 1 : 0) },
      { id: 4, inputs: [11, 12], output: 13, eval: (a, b) => (a === 0 && b === 0 ? 1 : 0) }
    ]
  },

  '7486': {
    partNumber: '7486',
    name: 'Quad 2-Input XOR Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input Exclusive-OR gates. Y = A ⊕ B',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      4: { name: '2A', type: 'input', group: 2, role: 'A' },
      5: { name: '2B', type: 'input', group: 2, role: 'B' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3A', type: 'input', group: 3, role: 'A' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      12: { name: '4A', type: 'input', group: 4, role: 'A' },
      13: { name: '4B', type: 'input', group: 4, role: 'B' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2], output: 3, eval: (a, b) => (a ^ b) },
      { id: 2, inputs: [4, 5], output: 6, eval: (a, b) => (a ^ b) },
      { id: 3, inputs: [9, 10], output: 8, eval: (a, b) => (a ^ b) },
      { id: 4, inputs: [12, 13], output: 11, eval: (a, b) => (a ^ b) }
    ]
  },

  '74266': {
    partNumber: '74266',
    name: 'Quad 2-Input XNOR Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input Exclusive-NOR gates. Y = (A ⊕ B)̅',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      4: { name: '2A', type: 'input', group: 2, role: 'A' },
      5: { name: '2B', type: 'input', group: 2, role: 'B' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3A', type: 'input', group: 3, role: 'A' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '4Y', type: 'output', group: 4, role: 'Y' },
      12: { name: '4A', type: 'input', group: 4, role: 'A' },
      13: { name: '4B', type: 'input', group: 4, role: 'B' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2], output: 3, eval: (a, b) => (a === b ? 1 : 0) },
      { id: 2, inputs: [4, 5], output: 6, eval: (a, b) => (a === b ? 1 : 0) },
      { id: 3, inputs: [9, 10], output: 8, eval: (a, b) => (a === b ? 1 : 0) },
      { id: 4, inputs: [12, 13], output: 11, eval: (a, b) => (a === b ? 1 : 0) }
    ]
  },

  '7410': {
    partNumber: '7410',
    name: 'Triple 3-Input NAND Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Three independent 3-input NAND gates. Y = (A · B · C)̅',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '2A', type: 'input', group: 2, role: 'A' },
      4: { name: '2B', type: 'input', group: 2, role: 'B' },
      5: { name: '2C', type: 'input', group: 2, role: 'C' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3C', type: 'input', group: 3, role: 'C' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '3A', type: 'input', group: 3, role: 'A' },
      12: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      13: { name: '1C', type: 'input', group: 1, role: 'C' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2, 13], output: 12, eval: (a, b, c) => (a === 1 && b === 1 && c === 1 ? 0 : 1) },
      { id: 2, inputs: [3, 4, 5], output: 6, eval: (a, b, c) => (a === 1 && b === 1 && c === 1 ? 0 : 1) },
      { id: 3, inputs: [11, 10, 9], output: 8, eval: (a, b, c) => (a === 1 && b === 1 && c === 1 ? 0 : 1) }
    ]
  },

  '7411': {
    partNumber: '7411',
    name: 'Triple 3-Input AND Gate',
    category: 'Gates',
    pinCount: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Three independent 3-input AND gates. Y = A · B · C',
    pins: {
      1: { name: '1A', type: 'input', group: 1, role: 'A' },
      2: { name: '1B', type: 'input', group: 1, role: 'B' },
      3: { name: '2A', type: 'input', group: 2, role: 'A' },
      4: { name: '2B', type: 'input', group: 2, role: 'B' },
      5: { name: '2C', type: 'input', group: 2, role: 'C' },
      6: { name: '2Y', type: 'output', group: 2, role: 'Y' },
      7: { name: 'GND', type: 'power', role: 'GND' },
      8: { name: '3Y', type: 'output', group: 3, role: 'Y' },
      9: { name: '3C', type: 'input', group: 3, role: 'C' },
      10: { name: '3B', type: 'input', group: 3, role: 'B' },
      11: { name: '3A', type: 'input', group: 3, role: 'A' },
      12: { name: '1Y', type: 'output', group: 1, role: 'Y' },
      13: { name: '1C', type: 'input', group: 1, role: 'C' },
      14: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    gates: [
      { id: 1, inputs: [1, 2, 13], output: 12, eval: (a, b, c) => (a === 1 && b === 1 && c === 1 ? 1 : 0) },
      { id: 2, inputs: [3, 4, 5], output: 6, eval: (a, b, c) => (a === 1 && b === 1 && c === 1 ? 1 : 0) },
      { id: 3, inputs: [11, 10, 9], output: 8, eval: (a, b, c) => (a === 1 && b === 1 && c === 1 ? 1 : 0) }
    ]
  },

  '74153': {
    partNumber: '74153',
    name: 'Dual 4-Line to 1-Line Data Selector / MUX',
    category: 'MSI',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Dual 4-to-1 Multiplexer with common select lines (A, B) and individual active-low enables (1G, 2G).',
    pins: {
      1: { name: '1G', type: 'input', role: 'ENABLE_A', activeLow: true }, // Strobe 1, active low
      2: { name: 'B', type: 'input', role: 'SEL_1' },  // Select B (S1)
      3: { name: '1C3', type: 'input', role: 'DATA' }, // 1C3
      4: { name: '1C2', type: 'input', role: 'DATA' }, // 1C2
      5: { name: '1C1', type: 'input', role: 'DATA' }, // 1C1
      6: { name: '1C0', type: 'input', role: 'DATA' }, // 1C0
      7: { name: '1Y', type: 'output', role: 'OUT_1' }, // 1Y
      8: { name: 'GND', type: 'power', role: 'GND' },
      9: { name: '2Y', type: 'output', role: 'OUT_2' }, // 2Y
      10: { name: '2C0', type: 'input', role: 'DATA' }, // 2C0
      11: { name: '2C1', type: 'input', role: 'DATA' }, // 2C1
      12: { name: '2C2', type: 'input', role: 'DATA' }, // 2C2
      13: { name: '2C3', type: 'input', role: 'DATA' }, // 2C3
      14: { name: 'A', type: 'input', role: 'SEL_0' },  // Select A (S0)
      15: { name: '2G', type: 'input', role: 'ENABLE_B', activeLow: true }, // Strobe 2, active low
      16: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    evaluate: (pinValues) => {
      const outputs = {};
      const s0 = pinValues[14]; // A
      const s1 = pinValues[2];  // B

      // MUX 1
      const g1 = pinValues[1]; // active low
      if (g1 === 1) {
        outputs[7] = 0; // disabled strobe forces output low
      } else if (g1 === 0 && s0 !== undefined && s1 !== undefined) {
        const sel = (s1 << 1) | s0;
        const cMap = { 0: pinValues[6], 1: pinValues[5], 2: pinValues[4], 3: pinValues[3] };
        outputs[7] = cMap[sel] !== undefined ? cMap[sel] : undefined;
      }

      // MUX 2
      const g2 = pinValues[15]; // active low
      if (g2 === 1) {
        outputs[9] = 0; // disabled
      } else if (g2 === 0 && s0 !== undefined && s1 !== undefined) {
        const sel = (s1 << 1) | s0;
        const cMap = { 0: pinValues[10], 1: pinValues[11], 2: pinValues[12], 3: pinValues[13] };
        outputs[9] = cMap[sel] !== undefined ? cMap[sel] : undefined;
      }

      return outputs;
    }
  },

  '74139': {
    partNumber: '74139',
    name: 'Dual 1-Line to 4-Line De-MUX / 2-to-4 Decoder',
    category: 'MSI',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Dual 2-to-4 active-low decoder / demultiplexer with individual active-low enables.',
    pins: {
      1: { name: '1G', type: 'input', role: 'ENABLE_A', activeLow: true },
      2: { name: '1A', type: 'input', role: 'SEL_A' },
      3: { name: '1B', type: 'input', role: 'SEL_B' },
      4: { name: '1Y0', type: 'output', role: 'OUT_0', activeLow: true },
      5: { name: '1Y1', type: 'output', role: 'OUT_1', activeLow: true },
      6: { name: '1Y2', type: 'output', role: 'OUT_2', activeLow: true },
      7: { name: '1Y3', type: 'output', role: 'OUT_3', activeLow: true },
      8: { name: 'GND', type: 'power', role: 'GND' },
      9: { name: '2Y3', type: 'output', role: 'OUT_3', activeLow: true },
      10: { name: '2Y2', type: 'output', role: 'OUT_2', activeLow: true },
      11: { name: '2Y1', type: 'output', role: 'OUT_1', activeLow: true },
      12: { name: '2Y0', type: 'output', role: 'OUT_0', activeLow: true },
      13: { name: '2B', type: 'input', role: 'SEL_B' },
      14: { name: '2A', type: 'input', role: 'SEL_A' },
      15: { name: '2G', type: 'input', role: 'ENABLE_B', activeLow: true },
      16: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    evaluate: (pinValues) => {
      const outputs = {};

      // Demux 1
      const g1 = pinValues[1];
      if (g1 === 1) {
        // Disabled: all outputs HIGH (inactive)
        outputs[4] = 1; outputs[5] = 1; outputs[6] = 1; outputs[7] = 1;
      } else if (g1 === 0) {
        const a = pinValues[2];
        const b = pinValues[3];
        if (a !== undefined && b !== undefined) {
          const sel = (b << 1) | a;
          outputs[4] = sel === 0 ? 0 : 1;
          outputs[5] = sel === 1 ? 0 : 1;
          outputs[6] = sel === 2 ? 0 : 1;
          outputs[7] = sel === 3 ? 0 : 1;
        }
      }

      // Demux 2
      const g2 = pinValues[15];
      if (g2 === 1) {
        outputs[12] = 1; outputs[11] = 1; outputs[10] = 1; outputs[9] = 1;
      } else if (g2 === 0) {
        const a = pinValues[14];
        const b = pinValues[13];
        if (a !== undefined && b !== undefined) {
          const sel = (b << 1) | a;
          outputs[12] = sel === 0 ? 0 : 1;
          outputs[11] = sel === 1 ? 0 : 1;
          outputs[10] = sel === 2 ? 0 : 1;
          outputs[9] = sel === 3 ? 0 : 1;
        }
      }

      return outputs;
    }
  },

  '74138': {
    partNumber: '74138',
    name: '3-Line to 8-Line Decoder / De-MUX',
    category: 'MSI',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: '3-to-8 line decoder with 3 enable inputs (G1 high, G2A low, G2B low) and 8 active-low outputs.',
    pins: {
      1: { name: 'A', type: 'input', role: 'SEL_A' },   // A (LSB)
      2: { name: 'B', type: 'input', role: 'SEL_B' },   // B
      3: { name: 'C', type: 'input', role: 'SEL_C' },   // C (MSB)
      4: { name: 'G2A', type: 'input', role: 'ENABLE_LOW', activeLow: true }, // active low enable
      5: { name: 'G2B', type: 'input', role: 'ENABLE_LOW', activeLow: true }, // active low enable
      6: { name: 'G1', type: 'input', role: 'ENABLE_HIGH' },                  // active high enable
      7: { name: 'Y7', type: 'output', role: 'OUT_7', activeLow: true },
      8: { name: 'GND', type: 'power', role: 'GND' },
      9: { name: 'Y6', type: 'output', role: 'OUT_6', activeLow: true },
      10: { name: 'Y5', type: 'output', role: 'OUT_5', activeLow: true },
      11: { name: 'Y4', type: 'output', role: 'OUT_4', activeLow: true },
      12: { name: 'Y3', type: 'output', role: 'OUT_3', activeLow: true },
      13: { name: 'Y2', type: 'output', role: 'OUT_2', activeLow: true },
      14: { name: 'Y1', type: 'output', role: 'OUT_1', activeLow: true },
      15: { name: 'Y0', type: 'output', role: 'OUT_0', activeLow: true },
      16: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    evaluate: (pinValues) => {
      const outputs = {};
      const g1 = pinValues[6];
      const g2a = pinValues[4];
      const g2b = pinValues[5];

      // Default disabled: all active-low outputs are 1 (inactive)
      const outPins = [15, 14, 13, 12, 11, 10, 9, 7]; // Y0 to Y7
      if (g1 === 0 || g2a === 1 || g2b === 1) {
        outPins.forEach(p => { outputs[p] = 1; });
        return outputs;
      }

      if (g1 === 1 && g2a === 0 && g2b === 0) {
        const a = pinValues[1];
        const b = pinValues[2];
        const c = pinValues[3];
        if (a !== undefined && b !== undefined && c !== undefined) {
          const val = (c << 2) | (b << 1) | a;
          outPins.forEach((p, idx) => {
            outputs[p] = (idx === val) ? 0 : 1;
          });
          return outputs;
        }
      }

      return outputs;
    }
  },

  '74148': {
    partNumber: '74148',
    name: '8-Line to 3-Line Priority Encoder',
    category: 'MSI',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: '8-to-3 line priority encoder with active-low inputs (0-7), active-low outputs (A0-A2), EI, EO, GS.',
    pins: {
      1: { name: '4', type: 'input', role: 'DATA_4', activeLow: true },
      2: { name: '5', type: 'input', role: 'DATA_5', activeLow: true },
      3: { name: '6', type: 'input', role: 'DATA_6', activeLow: true },
      4: { name: '7', type: 'input', role: 'DATA_7', activeLow: true },
      5: { name: 'EI', type: 'input', role: 'ENABLE_IN', activeLow: true },
      6: { name: 'A2', type: 'output', role: 'OUT_2', activeLow: true },
      7: { name: 'A1', type: 'output', role: 'OUT_1', activeLow: true },
      8: { name: 'GND', type: 'power', role: 'GND' },
      9: { name: 'A0', type: 'output', role: 'OUT_0', activeLow: true },
      10: { name: '0', type: 'input', role: 'DATA_0', activeLow: true },
      11: { name: '1', type: 'input', role: 'DATA_1', activeLow: true },
      12: { name: '2', type: 'input', role: 'DATA_2', activeLow: true },
      13: { name: '3', type: 'input', role: 'DATA_3', activeLow: true },
      14: { name: 'GS', type: 'output', role: 'GROUP_SELECT', activeLow: true },
      15: { name: 'EO', type: 'output', role: 'ENABLE_OUT', activeLow: true },
      16: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    evaluate: (pinValues) => {
      const outputs = {};
      const ei = pinValues[5]; // active low enable input

      if (ei === 1) {
        // Disabled: all outputs HIGH
        outputs[9] = 1;  // A0
        outputs[7] = 1;  // A1
        outputs[6] = 1;  // A2
        outputs[14] = 1; // GS
        outputs[15] = 1; // EO
        return outputs;
      }

      if (ei === 0) {
        // Inputs map: Pin index to logic line index 0..7
        const inputPins = [10, 11, 12, 13, 1, 2, 3, 4];
        let highestActive = -1;
        for (let i = 7; i >= 0; i--) {
          if (pinValues[inputPins[i]] === 0) { // active low input
            highestActive = i;
            break;
          }
        }

        if (highestActive === -1) {
          // No inputs active: outputs HIGH, GS HIGH, EO LOW
          outputs[9] = 1;
          outputs[7] = 1;
          outputs[6] = 1;
          outputs[14] = 1; // GS inactive
          outputs[15] = 0; // EO active (propagates enable)
        } else {
          // Output is complement of binary value of highest input (active low outputs)
          outputs[9] = (highestActive & 1) ? 0 : 1; // A0
          outputs[7] = (highestActive & 2) ? 0 : 1; // A1
          outputs[6] = (highestActive & 4) ? 0 : 1; // A2
          outputs[14] = 0; // GS active (0)
          outputs[15] = 1; // EO inactive (1)
        }
      }

      return outputs;
    }
  },

  '7485': {
    partNumber: '7485',
    name: '4-Bit Magnitude Comparator',
    category: 'MSI',
    pinCount: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Compares two 4-bit binary words (A3..A0 and B3..B0) with cascade expansion inputs.',
    pins: {
      1: { name: 'B3', type: 'input', role: 'B3' },
      2: { name: 'IA<B', type: 'input', role: 'CAS_LT' },
      3: { name: 'IA=B', type: 'input', role: 'CAS_EQ' }, // Tied high for standalone
      4: { name: 'IA>B', type: 'input', role: 'CAS_GT' },
      5: { name: 'OA>B', type: 'output', role: 'OUT_GT' },
      6: { name: 'OA=B', type: 'output', role: 'OUT_EQ' },
      7: { name: 'OA<B', type: 'output', role: 'OUT_LT' },
      8: { name: 'GND', type: 'power', role: 'GND' },
      9: { name: 'B0', type: 'input', role: 'B0' },
      10: { name: 'A0', type: 'input', role: 'A0' },
      11: { name: 'B1', type: 'input', role: 'B1' },
      12: { name: 'A1', type: 'input', role: 'A1' },
      13: { name: 'A2', type: 'input', role: 'A2' },
      14: { name: 'B2', type: 'input', role: 'B2' },
      15: { name: 'A3', type: 'input', role: 'A3' },
      16: { name: 'VCC', type: 'power', role: 'VCC' }
    },
    evaluate: (pinValues) => {
      const outputs = {};
      const a3 = pinValues[15], a2 = pinValues[13], a1 = pinValues[12], a0 = pinValues[10];
      const b3 = pinValues[1],  b2 = pinValues[14], b1 = pinValues[11], b0 = pinValues[9];
      const iGt = pinValues[4] || 0;
      const iEq = pinValues[3] === undefined ? 1 : pinValues[3]; // typically tied to Vcc
      const iLt = pinValues[2] || 0;

      if ([a3, a2, a1, a0, b3, b2, b1, b0].some(v => v === undefined)) {
        return outputs;
      }

      const valA = (a3 << 3) | (a2 << 2) | (a1 << 1) | a0;
      const valB = (b3 << 3) | (b2 << 2) | (b1 << 1) | b0;

      if (valA > valB) {
        outputs[5] = 1; outputs[6] = 0; outputs[7] = 0;
      } else if (valA < valB) {
        outputs[5] = 0; outputs[6] = 0; outputs[7] = 1;
      } else {
        // Equal: cascade inputs take effect
        outputs[5] = (iGt === 1) ? 1 : 0;
        outputs[6] = (iEq === 1 && iGt === 0 && iLt === 0) ? 1 : 0;
        outputs[7] = (iLt === 1) ? 1 : 0;
      }

      return outputs;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IC_DEFINITIONS };
}
