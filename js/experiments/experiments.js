/**
 * Experiments Curriculum for SRM Digital Electronics Laboratory (ECE 211 / CSE 207)
 * Experiments 1 to 5 + Bonus Experiment 6
 * Includes Aim, Apparatus, Theory, Schematics, Procedures, Truth Tables, and Reference Wirings.
 */

const EXPERIMENTS = [
  // ==========================================
  // EXPERIMENT 1: Realization of Basic Logic Gates
  // ==========================================
  {
    id: 'exp1_and',
    expNum: 1,
    subMode: 'AND',
    title: 'Exp 1: AND Gate (IC 7408)',
    aim: 'To study the 2-input AND gate using IC 7408 and verify its truth table.',
    apparatus: [
      { name: 'IC 7408 (Quad 2-Input AND Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The AND gate performs logical multiplication. The output is HIGH (1) only when both inputs are HIGH (1). The output is LOW (0) when any one of the inputs is LOW (0). Boolean Expression: Y = A · B.',
    procedure: [
      '1. Insert IC 7408 into Socket 1 with notch facing left.',
      '2. Connect Pin 14 of IC 7408 to +5V (Vcc) rail and Pin 7 to GND rail.',
      '3. Connect Switch 0 (A) to Pin 1 (1A) and Switch 1 (B) to Pin 2 (1B).',
      '4. Connect Pin 3 (1Y) to LED 0.',
      '5. Verify truth table for all four input combinations (00, 01, 10, 11).'
    ],
    requiredICs: ['7408'],
    defaultSockets: [{ socketId: 0, partNumber: '7408' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Expected Y'],
      rows: [
        { inputs: [0, 0], outputs: [0] },
        { inputs: [0, 1], outputs: [0] },
        { inputs: [1, 0], outputs: [0] },
        { inputs: [1, 1], outputs: [1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'IC_0_P3', to: 'LED_0', color: '#8e24aa' }
    ]
  },

  {
    id: 'exp1_or',
    expNum: 1,
    subMode: 'OR',
    title: 'Exp 1: OR Gate (IC 7432)',
    aim: 'To study the 2-input OR gate using IC 7432 and verify its truth table.',
    apparatus: [
      { name: 'IC 7432 (Quad 2-Input OR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The OR gate performs logical addition. The output is HIGH (1) when any one or both inputs are HIGH (1). The output is LOW (0) when both inputs are LOW (0). Boolean Expression: Y = A + B.',
    procedure: [
      '1. Insert IC 7432 into Socket 1 with notch facing left.',
      '2. Connect Pin 14 of IC 7432 to +5V (Vcc) rail and Pin 7 to GND rail.',
      '3. Connect Switch 0 (A) to Pin 1 (1A) and Switch 1 (B) to Pin 2 (1B).',
      '4. Connect Pin 3 (1Y) to LED 0.',
      '5. Verify truth table for all four input combinations.'
    ],
    requiredICs: ['7432'],
    defaultSockets: [{ socketId: 0, partNumber: '7432' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Expected Y'],
      rows: [
        { inputs: [0, 0], outputs: [0] },
        { inputs: [0, 1], outputs: [1] },
        { inputs: [1, 0], outputs: [1] },
        { inputs: [1, 1], outputs: [1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'IC_0_P3', to: 'LED_0', color: '#8e24aa' }
    ]
  },

  {
    id: 'exp1_not',
    expNum: 1,
    subMode: 'NOT',
    title: 'Exp 1: NOT Gate / Inverter (IC 7404)',
    aim: 'To study the NOT gate using IC 7404 and verify its truth table.',
    apparatus: [
      { name: 'IC 7404 (Hex Inverter)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The NOT gate (inverter) performs complementation. The output is HIGH (1) when input is LOW (0), and LOW (0) when input is HIGH (1). Boolean Expression: Y = A̅.',
    procedure: [
      '1. Insert IC 7404 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. Connect Switch 0 (A) to Pin 1 (1A).',
      '4. Connect Pin 2 (1Y) to LED 0.',
      '5. Observe LED status for A=0 and A=1.'
    ],
    requiredICs: ['7404'],
    defaultSockets: [{ socketId: 0, partNumber: '7404' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 0, label: 'Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['A', 'Expected Y'],
      rows: [
        { inputs: [0], outputs: [1] },
        { inputs: [1], outputs: [0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'IC_0_P2', to: 'LED_0', color: '#8e24aa' }
    ]
  },

  {
    id: 'exp1_nand',
    expNum: 1,
    subMode: 'NAND',
    title: 'Exp 1: NAND Gate (IC 7400)',
    aim: 'To study the 2-input NAND gate using IC 7400 and verify its truth table.',
    apparatus: [
      { name: 'IC 7400 (Quad 2-Input NAND Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The NAND gate is the complement of the AND gate. The output is LOW (0) only when both inputs are HIGH (1). In all other cases, the output is HIGH (1). Universal gate. Boolean Expression: Y = (A · B)̅.',
    procedure: [
      '1. Insert IC 7400 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. Connect Switch 0 to Pin 1 (1A) and Switch 1 to Pin 2 (1B).',
      '4. Connect Pin 3 (1Y) to LED 0.',
      '5. Verify truth table for all four input combinations.'
    ],
    requiredICs: ['7400'],
    defaultSockets: [{ socketId: 0, partNumber: '7400' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Expected Y'],
      rows: [
        { inputs: [0, 0], outputs: [1] },
        { inputs: [0, 1], outputs: [1] },
        { inputs: [1, 0], outputs: [1] },
        { inputs: [1, 1], outputs: [0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'IC_0_P3', to: 'LED_0', color: '#8e24aa' }
    ]
  },

  {
    id: 'exp1_nor',
    expNum: 1,
    subMode: 'NOR',
    title: 'Exp 1: NOR Gate (IC 7402)',
    aim: 'To study the 2-input NOR gate using IC 7402 and verify its truth table.',
    apparatus: [
      { name: 'IC 7402 (Quad 2-Input NOR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The NOR gate is the complement of the OR gate. The output is HIGH (1) only when both inputs are LOW (0). NOTE: IC 7402 has an inverted pinout: Output 1Y is on Pin 1, and inputs 1A, 1B are on Pins 2 and 3! Boolean Expression: Y = (A + B)̅.',
    procedure: [
      '1. Insert IC 7402 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. Connect Switch 0 to Pin 2 (1A) and Switch 1 to Pin 3 (1B).',
      '4. Connect Pin 1 (1Y) to LED 0.',
      '5. Verify truth table for all four input combinations.'
    ],
    requiredICs: ['7402'],
    defaultSockets: [{ socketId: 0, partNumber: '7402' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Expected Y'],
      rows: [
        { inputs: [0, 0], outputs: [1] },
        { inputs: [0, 1], outputs: [0] },
        { inputs: [1, 0], outputs: [0] },
        { inputs: [1, 1], outputs: [0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P2', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P3', color: '#43a047' },
      { from: 'IC_0_P1', to: 'LED_0', color: '#8e24aa' }
    ]
  },

  {
    id: 'exp1_xor',
    expNum: 1,
    subMode: 'XOR',
    title: 'Exp 1: Exclusive-OR Gate (IC 7486)',
    aim: 'To study the 2-input XOR gate using IC 7486 and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (Quad 2-Input XOR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The Exclusive-OR (XOR) gate gives a HIGH (1) output when the inputs are different, and a LOW (0) output when the inputs are identical. Boolean Expression: Y = A ⊕ B = A̅B + AB̅.',
    procedure: [
      '1. Insert IC 7486 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. Connect Switch 0 (A) to Pin 1 (1A) and Switch 1 (B) to Pin 2 (1B).',
      '4. Connect Pin 3 (1Y) to LED 0.',
      '5. Verify truth table for all four input combinations.'
    ],
    requiredICs: ['7486'],
    defaultSockets: [{ socketId: 0, partNumber: '7486' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Expected Y'],
      rows: [
        { inputs: [0, 0], outputs: [0] },
        { inputs: [0, 1], outputs: [1] },
        { inputs: [1, 0], outputs: [1] },
        { inputs: [1, 1], outputs: [0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'IC_0_P3', to: 'LED_0', color: '#8e24aa' }
    ]
  },

  // ==========================================
  // EXPERIMENT 2: Design of Code Converters
  // ==========================================
  {
    id: 'exp2_bin2gray',
    expNum: 2,
    subMode: 'BinaryToGray',
    title: 'Exp 2: Binary to Gray Code Converter (IC 7486)',
    aim: 'To design a 4-bit Binary to Gray code converter using IC 7486 and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (Quad 2-Input XOR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'In Gray code, two adjacent numbers differ by only one bit (reflected binary code / minimum change code). For a 4-bit binary word B3 B2 B1 B0, the Gray code bits are:\n• G3 = B3 (Direct connection)\n• G2 = B3 ⊕ B2\n• G1 = B2 ⊕ B1\n• G0 = B1 ⊕ B0\nImplemented with 3 XOR gates of a single IC 7486.',
    procedure: [
      '1. Insert IC 7486 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. Wire MSB B3 (SW 3) directly to LED 3 (G3) and to Pin 1 (1A) of IC 7486.',
      '4. Wire B2 (SW 2) to Pin 2 (1B) and Pin 4 (2A). Connect Pin 3 (1Y) to LED 2 (G2).',
      '5. Wire B1 (SW 1) to Pin 5 (2B) and Pin 9 (3A). Connect Pin 6 (2Y) to LED 1 (G1).',
      '6. Wire B0 (SW 0) to Pin 10 (3B). Connect Pin 8 (3Y) to LED 0 (G0).',
      '7. Test all 16 combinations (0000 to 1111) and record the Gray code outputs.'
    ],
    requiredICs: ['7486'],
    defaultSockets: [{ socketId: 0, partNumber: '7486' }],
    inputs: [
      { id: 3, label: 'B3 (SW 3)', switchIndex: 3 },
      { id: 2, label: 'B2 (SW 2)', switchIndex: 2 },
      { id: 1, label: 'B1 (SW 1)', switchIndex: 1 },
      { id: 0, label: 'B0 (SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 3, label: 'G3 (LED 3)', ledIndex: 3 },
      { id: 2, label: 'G2 (LED 2)', ledIndex: 2 },
      { id: 1, label: 'G1 (LED 1)', ledIndex: 1 },
      { id: 0, label: 'G0 (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['B3', 'B2', 'B1', 'B0', 'G3', 'G2', 'G1', 'G0'],
      rows: [
        { inputs: [0, 0, 0, 0], outputs: [0, 0, 0, 0] },
        { inputs: [0, 0, 0, 1], outputs: [0, 0, 0, 1] },
        { inputs: [0, 0, 1, 0], outputs: [0, 0, 1, 1] },
        { inputs: [0, 0, 1, 1], outputs: [0, 0, 1, 0] },
        { inputs: [0, 1, 0, 0], outputs: [0, 1, 1, 0] },
        { inputs: [0, 1, 0, 1], outputs: [0, 1, 1, 1] },
        { inputs: [0, 1, 1, 0], outputs: [0, 1, 0, 1] },
        { inputs: [0, 1, 1, 1], outputs: [0, 1, 0, 0] },
        { inputs: [1, 0, 0, 0], outputs: [1, 1, 0, 0] },
        { inputs: [1, 0, 0, 1], outputs: [1, 1, 0, 1] },
        { inputs: [1, 0, 1, 0], outputs: [1, 1, 1, 1] },
        { inputs: [1, 0, 1, 1], outputs: [1, 1, 1, 0] },
        { inputs: [1, 1, 0, 0], outputs: [1, 0, 1, 0] },
        { inputs: [1, 1, 0, 1], outputs: [1, 0, 1, 1] },
        { inputs: [1, 1, 1, 0], outputs: [1, 0, 0, 1] },
        { inputs: [1, 1, 1, 1], outputs: [1, 0, 0, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      // G3 = B3
      { from: 'SW_3', to: 'LED_3', color: '#ab47bc' },
      { from: 'SW_3', to: 'IC_0_P1', color: '#ab47bc' },
      // G2 = B3 ^ B2
      { from: 'SW_2', to: 'IC_0_P2', color: '#29b6f6' },
      { from: 'IC_0_P3', to: 'LED_2', color: '#29b6f6' },
      // G1 = B2 ^ B1
      { from: 'SW_2', to: 'IC_0_P4', color: '#26a69a' },
      { from: 'SW_1', to: 'IC_0_P5', color: '#ffee58' },
      { from: 'IC_0_P6', to: 'LED_1', color: '#ffee58' },
      // G0 = B1 ^ B0
      { from: 'SW_1', to: 'IC_0_P9', color: '#ffa726' },
      { from: 'SW_0', to: 'IC_0_P10', color: '#8d6e63' },
      { from: 'IC_0_P8', to: 'LED_0', color: '#8d6e63' }
    ]
  },

  {
    id: 'exp2_gray2bin',
    expNum: 2,
    subMode: 'GrayToBinary',
    title: 'Exp 2: Gray to Binary Code Converter (IC 7486)',
    aim: 'To design a 4-bit Gray to Binary code converter using IC 7486 and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (Quad 2-Input XOR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'In Gray to Binary conversion, the MSB remains identical, and each subsequent binary bit is obtained by XORing the previous calculated binary bit with the current Gray code bit:\n• B3 = G3 (Direct connection)\n• B2 = B3 ⊕ G2\n• B1 = B2 ⊕ G1\n• B0 = B1 ⊕ G0\nThis creates a cascading feedback connection through 3 XOR gates.',
    procedure: [
      '1. Insert IC 7486 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. Connect Switch 3 (G3) to LED 3 (B3) and to Pin 1 (1A) of IC 7486.',
      '4. Connect Switch 2 (G2) to Pin 2 (1B). Connect Pin 3 (1Y / B2) to LED 2 and to Pin 4 (2A).',
      '5. Connect Switch 1 (G1) to Pin 5 (2B). Connect Pin 6 (2Y / B1) to LED 1 and to Pin 9 (3A).',
      '6. Connect Switch 0 (G0) to Pin 10 (3B). Connect Pin 8 (3Y / B0) to LED 0.',
      '7. Test all 16 Gray code combinations and confirm expected Binary outputs.'
    ],
    requiredICs: ['7486'],
    defaultSockets: [{ socketId: 0, partNumber: '7486' }],
    inputs: [
      { id: 3, label: 'G3 (SW 3)', switchIndex: 3 },
      { id: 2, label: 'G2 (SW 2)', switchIndex: 2 },
      { id: 1, label: 'G1 (SW 1)', switchIndex: 1 },
      { id: 0, label: 'G0 (SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 3, label: 'B3 (LED 3)', ledIndex: 3 },
      { id: 2, label: 'B2 (LED 2)', ledIndex: 2 },
      { id: 1, label: 'B1 (LED 1)', ledIndex: 1 },
      { id: 0, label: 'B0 (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['G3', 'G2', 'G1', 'G0', 'B3', 'B2', 'B1', 'B0'],
      rows: [
        { inputs: [0, 0, 0, 0], outputs: [0, 0, 0, 0] },
        { inputs: [0, 0, 0, 1], outputs: [0, 0, 0, 1] },
        { inputs: [0, 0, 1, 1], outputs: [0, 0, 1, 0] },
        { inputs: [0, 0, 1, 0], outputs: [0, 0, 1, 1] },
        { inputs: [0, 1, 1, 0], outputs: [0, 1, 0, 0] },
        { inputs: [0, 1, 1, 1], outputs: [0, 1, 0, 1] },
        { inputs: [0, 1, 0, 1], outputs: [0, 1, 1, 0] },
        { inputs: [0, 1, 0, 0], outputs: [0, 1, 1, 1] },
        { inputs: [1, 1, 0, 0], outputs: [1, 0, 0, 0] },
        { inputs: [1, 1, 0, 1], outputs: [1, 0, 0, 1] },
        { inputs: [1, 1, 1, 1], outputs: [1, 0, 1, 0] },
        { inputs: [1, 1, 1, 0], outputs: [1, 0, 1, 1] },
        { inputs: [1, 0, 1, 0], outputs: [1, 1, 0, 0] },
        { inputs: [1, 0, 1, 1], outputs: [1, 1, 0, 1] },
        { inputs: [1, 0, 0, 1], outputs: [1, 1, 1, 0] },
        { inputs: [1, 0, 0, 0], outputs: [1, 1, 1, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7', color: '#1e88e5' },
      // B3 = G3
      { from: 'SW_3', to: 'LED_3', color: '#ab47bc' },
      { from: 'SW_3', to: 'IC_0_P1', color: '#ab47bc' },
      // B2 = B3 ^ G2
      { from: 'SW_2', to: 'IC_0_P2', color: '#29b6f6' },
      { from: 'IC_0_P3', to: 'LED_2', color: '#29b6f6' },
      { from: 'IC_0_P3', to: 'IC_0_P4', color: '#26a69a' },
      // B1 = B2 ^ G1
      { from: 'SW_1', to: 'IC_0_P5', color: '#ffee58' },
      { from: 'IC_0_P6', to: 'LED_1', color: '#ffee58' },
      { from: 'IC_0_P6', to: 'IC_0_P9', color: '#ffa726' },
      // B0 = B1 ^ G0
      { from: 'SW_0', to: 'IC_0_P10', color: '#8d6e63' },
      { from: 'IC_0_P8', to: 'LED_0', color: '#8d6e63' }
    ]
  },

  // ==========================================
  // EXPERIMENT 3: Combinational Logic Circuits (Adders & Subtractors)
  // ==========================================
  {
    id: 'exp3_half_adder',
    expNum: 3,
    subMode: 'HalfAdder',
    title: 'Exp 3: Half-Adder (IC 7486 & IC 7408)',
    aim: 'To design and construct a Half-Adder circuit using XOR and AND gates and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (XOR Gate)', qty: 1 },
      { name: 'IC 7408 (AND Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A half adder adds two 1-bit binary inputs A and B and produces two outputs: Sum (S) and Carry (C).\n• Sum S = A ⊕ B (obtained from XOR gate)\n• Carry C = A · B (obtained from AND gate).',
    procedure: [
      '1. Insert IC 7486 into Socket 1 and IC 7408 into Socket 2.',
      '2. Wire Pin 14 of both ICs to +5V and Pin 7 of both ICs to GND.',
      '3. Connect Switch 0 (A) to Pin 1 of 7486 and Pin 1 of 7408.',
      '4. Connect Switch 1 (B) to Pin 2 of 7486 and Pin 2 of 7408.',
      '5. Connect Pin 3 of 7486 (Sum) to LED 0.',
      '6. Connect Pin 3 of 7408 (Carry) to LED 1.',
      '7. Verify truth table for all four input combinations (00, 01, 10, 11).'
    ],
    requiredICs: ['7486', '7408'],
    defaultSockets: [
      { socketId: 0, partNumber: '7486' },
      { socketId: 1, partNumber: '7408' }
    ],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Sum S (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Carry C (LED 1)', ledIndex: 1 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Sum (S)', 'Carry (C)'],
      rows: [
        { inputs: [0, 0], outputs: [0, 0] },
        { inputs: [0, 1], outputs: [1, 0] },
        { inputs: [1, 0], outputs: [1, 0] },
        { inputs: [1, 1], outputs: [0, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_1_P14', color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P7', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_0', to: 'IC_1_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'SW_1', to: 'IC_1_P2', color: '#43a047' },
      { from: 'IC_0_P3', to: 'LED_0', color: '#8e24aa' },
      { from: 'IC_1_P3', to: 'LED_1', color: '#fb8c00' }
    ]
  },

  {
    id: 'exp3_half_subtractor',
    expNum: 3,
    subMode: 'HalfSubtractor',
    title: 'Exp 3: Half-Subtractor (IC 7486, IC 7404, IC 7408)',
    aim: 'To design and construct a Half-Subtractor circuit using XOR, NOT, and AND gates and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (XOR Gate)', qty: 1 },
      { name: 'IC 7404 (NOT Gate)', qty: 1 },
      { name: 'IC 7408 (AND Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A half subtractor subtracts bit B from bit A and produces Difference (D) and Borrow (B_out).\n• Difference D = A ⊕ B\n• Borrow B_out = A̅ · B\nImplemented using an XOR gate, an Inverter, and an AND gate.',
    procedure: [
      '1. Insert IC 7486 into Socket 1, IC 7404 into Socket 2, and IC 7408 into Socket 3.',
      '2. Wire Pin 14 of all three ICs to +5V and Pin 7 of all three ICs to GND.',
      '3. Connect Switch 0 (A) to Pin 1 of 7486 (IC 0) and Pin 1 of 7404 (IC 1).',
      '4. Connect Switch 1 (B) to Pin 2 of 7486 (IC 0) and Pin 2 of 7408 (IC 2).',
      '5. Connect Pin 3 of 7486 (Difference) to LED 0.',
      '6. Connect Pin 2 of 7404 (A̅) to Pin 1 of 7408.',
      '7. Connect Pin 3 of 7408 (Borrow) to LED 1.',
      '8. Verify truth table for all four input combinations.'
    ],
    requiredICs: ['7486', '7404', '7408'],
    defaultSockets: [
      { socketId: 0, partNumber: '7486' },
      { socketId: 1, partNumber: '7404' },
      { socketId: 2, partNumber: '7408' }
    ],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Difference D (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Borrow B (LED 1)', ledIndex: 1 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Difference (D)', 'Borrow (B)'],
      rows: [
        { inputs: [0, 0], outputs: [0, 0] },
        { inputs: [0, 1], outputs: [1, 1] },
        { inputs: [1, 0], outputs: [1, 0] },
        { inputs: [1, 1], outputs: [0, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_1_P14', color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P7', color: '#1e88e5' },
      { from: 'VCC_2', to: 'IC_2_P14', color: '#e53935' },
      { from: 'GND_2', to: 'IC_2_P7', color: '#1e88e5' },
      // Diff = A ^ B
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'IC_0_P3', to: 'LED_0', color: '#8e24aa' },
      // Invert A
      { from: 'SW_0', to: 'IC_1_P1', color: '#fbc02d' },
      // Borrow = A' . B
      { from: 'IC_1_P2', to: 'IC_2_P1', color: '#00acc1' },
      { from: 'SW_1', to: 'IC_2_P2', color: '#43a047' },
      { from: 'IC_2_P3', to: 'LED_1', color: '#fb8c00' }
    ]
  },

  {
    id: 'exp3_full_adder',
    expNum: 3,
    subMode: 'FullAdder',
    title: 'Exp 3: Full-Adder (IC 7486, IC 7408, IC 7432)',
    aim: 'To design and construct a Full-Adder circuit using XOR, AND, and OR gates and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (XOR Gate)', qty: 1 },
      { name: 'IC 7408 (AND Gate)', qty: 1 },
      { name: 'IC 7432 (OR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A full adder adds three 1-bit inputs: A, B, and Carry-in (Cin), producing Sum and Carry-out (Cout).\n• Sum S = A ⊕ B ⊕ Cin\n• Carry Cout = (A ⊕ B)·Cin + A·B\nConstructed using two half adders and one OR gate.',
    procedure: [
      '1. Insert IC 7486 (Socket 1), IC 7408 (Socket 2), and IC 7432 (Socket 3).',
      '2. Wire Pin 14 of all ICs to +5V and Pin 7 of all ICs to GND.',
      '3. Wire Switch 0 (A) and Switch 1 (B) to 7486 Pin 1 & Pin 2 (Gate 1), and to 7408 Pin 1 & Pin 2 (Gate 1).',
      '4. Connect 7486 Pin 3 (A ⊕ B) to 7486 Pin 4 (Gate 2 input) and 7408 Pin 4 (Gate 2 input).',
      '5. Connect Switch 2 (Cin) to 7486 Pin 5 and 7408 Pin 5.',
      '6. Connect 7486 Pin 6 (Sum) to LED 0.',
      '7. Connect 7408 Pin 3 (A·B) to 7432 Pin 1, and 7408 Pin 6 ((A ⊕ B)·Cin) to 7432 Pin 2.',
      '8. Connect 7432 Pin 3 (Cout) to LED 1.',
      '9. Verify all 8 combinations of inputs (000 to 111).'
    ],
    requiredICs: ['7486', '7408', '7432'],
    defaultSockets: [
      { socketId: 0, partNumber: '7486' },
      { socketId: 1, partNumber: '7408' },
      { socketId: 2, partNumber: '7432' }
    ],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 },
      { id: 2, label: 'Cin (SW 2)', switchIndex: 2 }
    ],
    outputs: [
      { id: 0, label: 'Sum (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Cout (LED 1)', ledIndex: 1 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Cin', 'Sum', 'Cout'],
      rows: [
        { inputs: [0, 0, 0], outputs: [0, 0] },
        { inputs: [0, 0, 1], outputs: [1, 0] },
        { inputs: [0, 1, 0], outputs: [1, 0] },
        { inputs: [0, 1, 1], outputs: [0, 1] },
        { inputs: [1, 0, 0], outputs: [1, 0] },
        { inputs: [1, 0, 1], outputs: [0, 1] },
        { inputs: [1, 1, 0], outputs: [0, 1] },
        { inputs: [1, 1, 1], outputs: [1, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_1_P14', color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P7', color: '#1e88e5' },
      { from: 'VCC_2', to: 'IC_2_P14', color: '#e53935' },
      { from: 'GND_2', to: 'IC_2_P7', color: '#1e88e5' },
      // Gate 1: A ^ B
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      // Gate 2: (A ^ B) ^ Cin -> Sum
      { from: 'IC_0_P3', to: 'IC_0_P4', color: '#ab47bc' },
      { from: 'SW_2', to: 'IC_0_P5', color: '#00acc1' },
      { from: 'IC_0_P6', to: 'LED_0', color: '#ab47bc' },
      // AND 1: A . B
      { from: 'SW_0', to: 'IC_1_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_1_P2', color: '#43a047' },
      // AND 2: (A ^ B) . Cin
      { from: 'IC_0_P3', to: 'IC_1_P4', color: '#ab47bc' },
      { from: 'SW_2', to: 'IC_1_P5', color: '#00acc1' },
      // OR: Cout
      { from: 'IC_1_P3', to: 'IC_2_P1', color: '#fb8c00' },
      { from: 'IC_1_P6', to: 'IC_2_P2', color: '#fb8c00' },
      { from: 'IC_2_P3', to: 'LED_1', color: '#fb8c00' }
    ]
  },

  {
    id: 'exp3_full_subtractor',
    expNum: 3,
    subMode: 'FullSubtractor',
    title: 'Exp 3: Full-Subtractor (IC 7486, IC 7404, IC 7408, IC 7432)',
    aim: 'To design and construct a Full-Subtractor circuit and verify its truth table.',
    apparatus: [
      { name: 'IC 7486 (XOR Gate)', qty: 1 },
      { name: 'IC 7404 (NOT Gate)', qty: 1 },
      { name: 'IC 7408 (AND Gate)', qty: 1 },
      { name: 'IC 7432 (OR Gate)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A full subtractor performs subtraction on three 1-bit inputs: A, B, and Borrow-in (Bin), producing Difference (D) and Borrow-out (Bout).\n• Difference D = A ⊕ B ⊕ Bin\n• Borrow-out Bout = (A ⊕ B)̅·Bin + A̅·B\nImplemented with 4 ICs on the trainer kit.',
    procedure: [
      '1. Insert IC 7486 (Sock 1), IC 7404 (Sock 2), IC 7408 (Sock 3), IC 7432 (Sock 4).',
      '2. Wire Pin 14 of all ICs to +5V and Pin 7 of all ICs to GND.',
      '3. Connect Switch 0 (A) to 7486 Pin 1 and 7404 Pin 1.',
      '4. Connect Switch 1 (B) to 7486 Pin 2 and 7408 Pin 2.',
      '5. Wire 7486 Pin 3 (A ⊕ B) to 7486 Pin 4 and to 7404 Pin 3.',
      '6. Wire Switch 2 (Bin) to 7486 Pin 5 and 7408 Pin 5.',
      '7. Wire 7486 Pin 6 (Difference) to LED 0.',
      '8. Wire 7404 Pin 2 (A̅) to 7408 Pin 1 (AND 1 input). Output 7408 Pin 3 goes to 7432 Pin 1.',
      '9. Wire 7404 Pin 4 ((A ⊕ B)̅) to 7408 Pin 4. Output 7408 Pin 6 goes to 7432 Pin 2.',
      '10. Wire 7432 Pin 3 (Bout) to LED 1.',
      '11. Verify truth table for all 8 input combinations.'
    ],
    requiredICs: ['7486', '7404', '7408', '7432'],
    defaultSockets: [
      { socketId: 0, partNumber: '7486' },
      { socketId: 1, partNumber: '7404' },
      { socketId: 2, partNumber: '7408' },
      { socketId: 3, partNumber: '7432' }
    ],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 },
      { id: 2, label: 'Bin (SW 2)', switchIndex: 2 }
    ],
    outputs: [
      { id: 0, label: 'Diff (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Bout (LED 1)', ledIndex: 1 }
    ],
    truthTable: {
      headers: ['A', 'B', 'Bin', 'Diff', 'Bout'],
      rows: [
        { inputs: [0, 0, 0], outputs: [0, 0] },
        { inputs: [0, 0, 1], outputs: [1, 1] },
        { inputs: [0, 1, 0], outputs: [1, 1] },
        { inputs: [0, 1, 1], outputs: [0, 1] },
        { inputs: [1, 0, 0], outputs: [1, 0] },
        { inputs: [1, 0, 1], outputs: [0, 0] },
        { inputs: [1, 1, 0], outputs: [0, 0] },
        { inputs: [1, 1, 1], outputs: [1, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P7', color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_1_P14', color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P7', color: '#1e88e5' },
      { from: 'VCC_2', to: 'IC_2_P14', color: '#e53935' },
      { from: 'GND_2', to: 'IC_2_P7', color: '#1e88e5' },
      { from: 'VCC_3', to: 'IC_3_P14', color: '#e53935' },
      { from: 'GND_3', to: 'IC_3_P7', color: '#1e88e5' },
      // Gate 1: A ^ B
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      // Gate 2: (A ^ B) ^ Bin -> Diff
      { from: 'IC_0_P3', to: 'IC_0_P4', color: '#ab47bc' },
      { from: 'SW_2', to: 'IC_0_P5', color: '#00acc1' },
      { from: 'IC_0_P6', to: 'LED_0', color: '#ab47bc' },
      // Inverter 1: A -> A'
      { from: 'SW_0', to: 'IC_1_P1', color: '#fbc02d' },
      // Inverter 2: (A ^ B) -> (A ^ B)'
      { from: 'IC_0_P3', to: 'IC_1_P3', color: '#ab47bc' },
      // AND 1: A' . B
      { from: 'IC_1_P2', to: 'IC_2_P1', color: '#ffb74d' },
      { from: 'SW_1', to: 'IC_2_P2', color: '#43a047' },
      // AND 2: (A ^ B)' . Bin
      { from: 'IC_1_P4', to: 'IC_2_P4', color: '#26c6da' },
      { from: 'SW_2', to: 'IC_2_P5', color: '#00acc1' },
      // OR: Bout
      { from: 'IC_2_P3', to: 'IC_3_P1', color: '#fb8c00' },
      { from: 'IC_2_P6', to: 'IC_3_P2', color: '#fb8c00' },
      { from: 'IC_3_P3', to: 'LED_1', color: '#fb8c00' }
    ]
  },

  // ==========================================
  // EXPERIMENT 4: Multiplexers and De-Multiplexers
  // ==========================================
  {
    id: 'exp4_mux',
    expNum: 4,
    subMode: 'Multiplexer',
    title: 'Exp 4: 4:1 Multiplexer (IC 74153)',
    aim: 'To design and verify the truth table of a 4-to-1 Multiplexer using IC 74153.',
    apparatus: [
      { name: 'IC 74153 (Dual 4:1 Data Selector/MUX)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A multiplexer routes one of multiple input data signals to a single output line based on binary select lines. IC 74153 contains two identical 4:1 multiplexers. Common select lines: S0 = Pin 14 (A), S1 = Pin 2 (B). For MUX 1: Strobe 1G is Pin 1 (active low). Data inputs: 1C0 (Pin 6), 1C1 (Pin 5), 1C2 (Pin 4), 1C3 (Pin 3). Output: 1Y (Pin 7).',
    procedure: [
      '1. Insert IC 74153 into Socket 1 (16 pins).',
      '2. Connect Pin 16 to +5V (Vcc) and Pin 8 to GND.',
      '3. Connect Pin 1 (1G Strobe) to GND to enable MUX 1.',
      '4. Connect Switch 0 to Pin 14 (Select S0 / A) and Switch 1 to Pin 2 (Select S1 / B).',
      '5. Connect Switch 2 to Pin 6 (1C0), Switch 3 to Pin 5 (1C1), Switch 4 to Pin 4 (1C2), and Switch 5 to Pin 3 (1C3).',
      '6. Connect Pin 7 (1Y) to LED 0.',
      '7. Test selecting each channel via S1, S0 (00 selects C0, 01 selects C1, 10 selects C2, 11 selects C3).'
    ],
    requiredICs: ['74153'],
    defaultSockets: [{ socketId: 0, partNumber: '74153' }],
    inputs: [
      { id: 0, label: 'S0/A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'S1/B (SW 1)', switchIndex: 1 },
      { id: 2, label: 'C0 (SW 2)', switchIndex: 2 },
      { id: 3, label: 'C1 (SW 3)', switchIndex: 3 },
      { id: 4, label: 'C2 (SW 4)', switchIndex: 4 },
      { id: 5, label: 'C3 (SW 5)', switchIndex: 5 }
    ],
    outputs: [
      { id: 0, label: '1Y (LED 0)', ledIndex: 0 }
    ],
    truthTable: {
      headers: ['S1', 'S0', 'Selected Input', 'Expected 1Y'],
      rows: [
        { inputs: [0, 0, 1, 0, 0, 0], outputs: [1] },
        { inputs: [0, 0, 0, 0, 0, 0], outputs: [0] },
        { inputs: [1, 0, 0, 1, 0, 0], outputs: [1] },
        { inputs: [1, 0, 0, 0, 0, 0], outputs: [0] },
        { inputs: [0, 1, 0, 0, 1, 0], outputs: [1] },
        { inputs: [0, 1, 0, 0, 0, 0], outputs: [0] },
        { inputs: [1, 1, 0, 0, 0, 1], outputs: [1] },
        { inputs: [1, 1, 0, 0, 0, 0], outputs: [0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P16', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P8', color: '#1e88e5' },
      { from: 'GND_1', to: 'IC_0_P1', color: '#1e88e5' }, // 1G enabled to GND
      { from: 'SW_0', to: 'IC_0_P14', color: '#fbc02d' }, // S0
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },  // S1
      { from: 'SW_2', to: 'IC_0_P6', color: '#00acc1' },  // 1C0
      { from: 'SW_3', to: 'IC_0_P5', color: '#ab47bc' },  // 1C1
      { from: 'SW_4', to: 'IC_0_P4', color: '#fb8c00' },  // 1C2
      { from: 'SW_5', to: 'IC_0_P3', color: '#e91e63' },  // 1C3
      { from: 'IC_0_P7', to: 'LED_0', color: '#00e676' }   // 1Y
    ]
  },

  {
    id: 'exp4_demux',
    expNum: 4,
    subMode: 'Demultiplexer',
    title: 'Exp 4: 1:4 De-Multiplexer / 2:4 Decoder (IC 74139)',
    aim: 'To design and verify the truth table of a 1-to-4 De-Multiplexer / 2-to-4 Decoder using IC 74139.',
    apparatus: [
      { name: 'IC 74139 (Dual 1:4 DEMUX / 2:4 Decoder)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A demultiplexer takes a single input signal and directs it to one of multiple outputs determined by binary select lines. IC 74139 contains two active-low 1:4 demux circuits. Enable 1G is Pin 1 (active low). Select lines: 1A = Pin 2, 1B = Pin 3. Outputs: 1Y0 (Pin 4), 1Y1 (Pin 5), 1Y2 (Pin 6), 1Y3 (Pin 7) - all active low.',
    procedure: [
      '1. Insert IC 74139 into Socket 1 (16 pins).',
      '2. Connect Pin 16 to +5V (Vcc) and Pin 8 to GND.',
      '3. Connect Pin 1 (1G Enable) to GND (or Switch 2).',
      '4. Connect Switch 0 to Pin 2 (1A) and Switch 1 to Pin 3 (1B).',
      '5. Connect Pins 4, 5, 6, 7 (1Y0, 1Y1, 1Y2, 1Y3) to LEDs 0, 1, 2, 3.',
      '6. Verify that the selected output goes LOW (0) corresponding to binary input B A.'
    ],
    requiredICs: ['74139'],
    defaultSockets: [{ socketId: 0, partNumber: '74139' }],
    inputs: [
      { id: 0, label: '1A (SW 0)', switchIndex: 0 },
      { id: 1, label: '1B (SW 1)', switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: '1Y0 (LED 0)', ledIndex: 0 },
      { id: 1, label: '1Y1 (LED 1)', ledIndex: 1 },
      { id: 2, label: '1Y2 (LED 2)', ledIndex: 2 },
      { id: 3, label: '1Y3 (LED 3)', ledIndex: 3 }
    ],
    truthTable: {
      headers: ['1B', '1A', '1Y0', '1Y1', '1Y2', '1Y3'],
      rows: [
        { inputs: [0, 0], outputs: [0, 1, 1, 1] },
        { inputs: [1, 0], outputs: [1, 0, 1, 1] },
        { inputs: [0, 1], outputs: [1, 1, 0, 1] },
        { inputs: [1, 1], outputs: [1, 1, 1, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P16', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P8', color: '#1e88e5' },
      { from: 'GND_1', to: 'IC_0_P1', color: '#1e88e5' },
      { from: 'SW_0', to: 'IC_0_P2', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P3', color: '#43a047' },
      { from: 'IC_0_P4', to: 'LED_0', color: '#29b6f6' },
      { from: 'IC_0_P5', to: 'LED_1', color: '#26a69a' },
      { from: 'IC_0_P6', to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P7', to: 'LED_3', color: '#ffa726' }
    ]
  },

  // ==========================================
  // EXPERIMENT 5: Design of Decoder and Encoder
  // ==========================================
  {
    id: 'exp5_decoder',
    expNum: 5,
    subMode: 'Decoder',
    title: 'Exp 5: 3:8 Decoder (IC 74138)',
    aim: 'To verify the operation of a 3-to-8 line Decoder using IC 74138.',
    apparatus: [
      { name: 'IC 74138 (3:8 Line Decoder/De-MUX)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A 3:8 decoder decodes a 3-bit binary input into 8 mutually exclusive active-low outputs. IC 74138 features 3 enable inputs: G1 (Pin 6, active HIGH), G2A (Pin 4, active LOW), and G2B (Pin 5, active LOW). When enabled (G1=1, G2A=0, G2B=0), exactly one output (Y0 to Y7) is driven LOW.',
    procedure: [
      '1. Insert IC 74138 into Socket 1 (16 pins).',
      '2. Connect Pin 16 to +5V (Vcc) and Pin 8 to GND.',
      '3. Connect Pin 6 (G1) to +5V. Connect Pin 4 (G2A) and Pin 5 (G2B) to GND.',
      '4. Connect Switch 0 to Pin 1 (A), Switch 1 to Pin 2 (B), Switch 2 to Pin 3 (C).',
      '5. Connect outputs Y0..Y7 (Pins 15, 14, 13, 12, 11, 10, 9, 7) to LEDs 0..7.',
      '6. Verify that for each binary code C B A, only the corresponding LED turns OFF (0V / active-low).'
    ],
    requiredICs: ['74138'],
    defaultSockets: [{ socketId: 0, partNumber: '74138' }],
    inputs: [
      { id: 0, label: 'A (SW 0)', switchIndex: 0 },
      { id: 1, label: 'B (SW 1)', switchIndex: 1 },
      { id: 2, label: 'C (SW 2)', switchIndex: 2 }
    ],
    outputs: [
      { id: 0, label: 'Y0 (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Y1 (LED 1)', ledIndex: 1 },
      { id: 2, label: 'Y2 (LED 2)', ledIndex: 2 },
      { id: 3, label: 'Y3 (LED 3)', ledIndex: 3 },
      { id: 4, label: 'Y4 (LED 4)', ledIndex: 4 },
      { id: 5, label: 'Y5 (LED 5)', ledIndex: 5 },
      { id: 6, label: 'Y6 (LED 6)', ledIndex: 6 },
      { id: 7, label: 'Y7 (LED 7)', ledIndex: 7 }
    ],
    truthTable: {
      headers: ['C', 'B', 'A', 'Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7'],
      rows: [
        { inputs: [0, 0, 0], outputs: [0, 1, 1, 1, 1, 1, 1, 1] },
        { inputs: [1, 0, 0], outputs: [1, 0, 1, 1, 1, 1, 1, 1] },
        { inputs: [0, 1, 0], outputs: [1, 1, 0, 1, 1, 1, 1, 1] },
        { inputs: [1, 1, 0], outputs: [1, 1, 1, 0, 1, 1, 1, 1] },
        { inputs: [0, 0, 1], outputs: [1, 1, 1, 1, 0, 1, 1, 1] },
        { inputs: [1, 0, 1], outputs: [1, 1, 1, 1, 1, 0, 1, 1] },
        { inputs: [0, 1, 1], outputs: [1, 1, 1, 1, 1, 1, 0, 1] },
        { inputs: [1, 1, 1], outputs: [1, 1, 1, 1, 1, 1, 1, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P16', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P8', color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_0_P6', color: '#e53935' }, // G1 = 1
      { from: 'GND_1', to: 'IC_0_P4', color: '#1e88e5' }, // G2A = 0
      { from: 'GND_2', to: 'IC_0_P5', color: '#1e88e5' }, // G2B = 0
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P2', color: '#43a047' },
      { from: 'SW_2', to: 'IC_0_P3', color: '#00acc1' },
      { from: 'IC_0_P15', to: 'LED_0', color: '#ab47bc' },
      { from: 'IC_0_P14', to: 'LED_1', color: '#ab47bc' },
      { from: 'IC_0_P13', to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P12', to: 'LED_3', color: '#ab47bc' },
      { from: 'IC_0_P11', to: 'LED_4', color: '#ab47bc' },
      { from: 'IC_0_P10', to: 'LED_5', color: '#ab47bc' },
      { from: 'IC_0_P9', to: 'LED_6', color: '#ab47bc' },
      { from: 'IC_0_P7', to: 'LED_7', color: '#ab47bc' }
    ]
  },

  {
    id: 'exp5_encoder',
    expNum: 5,
    subMode: 'Encoder',
    title: 'Exp 5: 8:3 Priority Encoder (IC 74148)',
    aim: 'To verify the operation of an 8-to-3 line Priority Encoder using IC 74148.',
    apparatus: [
      { name: 'IC 74148 (8:3 Priority Encoder)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A priority encoder produces an output corresponding to the highest-priority active input. In IC 74148, inputs 0 to 7 and outputs A2 A1 A0 are active LOW. Input 7 has highest priority, input 0 has lowest. Enable input EI (Pin 5) must be held LOW to activate encoding. Group Select GS (Pin 14) goes LOW when any input is active.',
    procedure: [
      '1. Insert IC 74148 into Socket 1 (16 pins).',
      '2. Connect Pin 16 to +5V (Vcc) and Pin 8 to GND.',
      '3. Connect Pin 5 (EI) to GND (active LOW enable).',
      '4. Connect Switches 0 to 7 to active-low inputs 0..7 (Pins 10, 11, 12, 13, 1, 2, 3, 4).',
      '5. Connect outputs A0 (Pin 9), A1 (Pin 7), A2 (Pin 6) to LEDs 0, 1, 2.',
      '6. Connect GS (Pin 14) to LED 6 and EO (Pin 15) to LED 7.',
      '7. Verify priority behavior by asserting multiple inputs LOW simultaneously.'
    ],
    requiredICs: ['74148'],
    defaultSockets: [{ socketId: 0, partNumber: '74148' }],
    inputs: [
      { id: 7, label: 'I7 (SW 7)', switchIndex: 7 },
      { id: 6, label: 'I6 (SW 6)', switchIndex: 6 },
      { id: 5, label: 'I5 (SW 5)', switchIndex: 5 },
      { id: 4, label: 'I4 (SW 4)', switchIndex: 4 },
      { id: 3, label: 'I3 (SW 3)', switchIndex: 3 },
      { id: 2, label: 'I2 (SW 2)', switchIndex: 2 },
      { id: 1, label: 'I1 (SW 1)', switchIndex: 1 },
      { id: 0, label: 'I0 (SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 2, label: 'A2 (LED 2)', ledIndex: 2 },
      { id: 1, label: 'A1 (LED 1)', ledIndex: 1 },
      { id: 0, label: 'A0 (LED 0)', ledIndex: 0 },
      { id: 6, label: 'GS (LED 6)', ledIndex: 6 },
      { id: 7, label: 'EO (LED 7)', ledIndex: 7 }
    ],
    truthTable: {
      headers: ['I7', 'I6', 'I5', 'I4', 'I3', 'I2', 'I1', 'I0', 'A2', 'A1', 'A0', 'GS', 'EO'],
      rows: [
        { inputs: [1, 1, 1, 1, 1, 1, 1, 1], outputs: [1, 1, 1, 1, 0] },
        { inputs: [1, 1, 1, 1, 1, 1, 1, 0], outputs: [1, 1, 1, 0, 1] },
        { inputs: [1, 1, 1, 1, 1, 1, 0, 1], outputs: [1, 1, 0, 0, 1] },
        { inputs: [1, 1, 1, 1, 1, 0, 1, 1], outputs: [1, 0, 1, 0, 1] },
        { inputs: [1, 1, 1, 1, 0, 1, 1, 1], outputs: [1, 0, 0, 0, 1] },
        { inputs: [1, 1, 1, 0, 1, 1, 1, 1], outputs: [0, 1, 1, 0, 1] },
        { inputs: [1, 1, 0, 1, 1, 1, 1, 1], outputs: [0, 1, 0, 0, 1] },
        { inputs: [1, 0, 1, 1, 1, 1, 1, 1], outputs: [0, 0, 1, 0, 1] },
        { inputs: [0, 1, 1, 1, 1, 1, 1, 1], outputs: [0, 0, 0, 0, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P16', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P8', color: '#1e88e5' },
      { from: 'GND_1', to: 'IC_0_P5', color: '#1e88e5' }, // EI = 0
      { from: 'SW_0', to: 'IC_0_P10', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P11', color: '#fbc02d' },
      { from: 'SW_2', to: 'IC_0_P12', color: '#fbc02d' },
      { from: 'SW_3', to: 'IC_0_P13', color: '#fbc02d' },
      { from: 'SW_4', to: 'IC_0_P1', color: '#fbc02d' },
      { from: 'SW_5', to: 'IC_0_P2', color: '#fbc02d' },
      { from: 'SW_6', to: 'IC_0_P3', color: '#fbc02d' },
      { from: 'SW_7', to: 'IC_0_P4', color: '#fbc02d' },
      { from: 'IC_0_P9', to: 'LED_0', color: '#29b6f6' }, // A0
      { from: 'IC_0_P7', to: 'LED_1', color: '#29b6f6' }, // A1
      { from: 'IC_0_P6', to: 'LED_2', color: '#29b6f6' }, // A2
      { from: 'IC_0_P14', to: 'LED_6', color: '#fb8c00' }, // GS
      { from: 'IC_0_P15', to: 'LED_7', color: '#8e24aa' }  // EO
    ]
  },

  // ==========================================
  // EXPERIMENT 6: Magnitude Comparator (from lab manual page 17)
  // ==========================================
  {
    id: 'exp6_comparator',
    expNum: 6,
    subMode: 'Comparator',
    title: 'Exp 6: 4-Bit Magnitude Comparator (IC 7485)',
    aim: 'To verify the operation of a 4-bit Magnitude Comparator using IC 7485.',
    apparatus: [
      { name: 'IC 7485 (4-Bit Magnitude Comparator)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A magnitude comparator compares two binary numbers A and B and determines whether A > B, A = B, or A < B. IC 7485 compares two 4-bit words (A3..A0 and B3..B0). Pin 3 (IA=B) must be connected to +5V (Vcc) for standalone operation. Outputs: OA>B (Pin 5), OA=B (Pin 6), OA<B (Pin 7).',
    procedure: [
      '1. Insert IC 7485 into Socket 1 (16 pins).',
      '2. Connect Pin 16 to +5V (Vcc) and Pin 8 to GND.',
      '3. Connect Pin 3 (IA=B) to +5V (Vcc). Connect Pin 2 (IA<B) and Pin 4 (IA>B) to GND.',
      '4. Connect Switches 0..3 (A0..A3) to Pins 10, 12, 13, 15.',
      '5. Connect Switches 4..7 (B0..B3) to Pins 9, 11, 14, 1.',
      '6. Connect outputs OA>B (Pin 5), OA=B (Pin 6), OA<B (Pin 7) to LEDs 0, 1, 2.',
      '7. Test various 4-bit input combinations where A > B, A = B, and A < B.'
    ],
    requiredICs: ['7485'],
    defaultSockets: [{ socketId: 0, partNumber: '7485' }],
    inputs: [
      { id: 0, label: 'A0 (SW 0)', switchIndex: 0 },
      { id: 1, label: 'A1 (SW 1)', switchIndex: 1 },
      { id: 2, label: 'A2 (SW 2)', switchIndex: 2 },
      { id: 3, label: 'A3 (SW 3)', switchIndex: 3 },
      { id: 4, label: 'B0 (SW 4)', switchIndex: 4 },
      { id: 5, label: 'B1 (SW 5)', switchIndex: 5 },
      { id: 6, label: 'B2 (SW 6)', switchIndex: 6 },
      { id: 7, label: 'B3 (SW 7)', switchIndex: 7 }
    ],
    outputs: [
      { id: 0, label: 'A > B (LED 0)', ledIndex: 0 },
      { id: 1, label: 'A = B (LED 1)', ledIndex: 1 },
      { id: 2, label: 'A < B (LED 2)', ledIndex: 2 }
    ],
    truthTable: {
      headers: ['A3..A0', 'B3..B0', 'A > B', 'A = B', 'A < B'],
      rows: [
        { inputs: [0, 0, 0, 0, 0, 0, 0, 0], outputs: [0, 1, 0] },
        { inputs: [1, 0, 0, 0, 0, 0, 0, 0], outputs: [1, 0, 0] },
        { inputs: [0, 0, 0, 0, 1, 0, 0, 0], outputs: [0, 0, 1] },
        { inputs: [1, 1, 0, 0, 1, 1, 0, 0], outputs: [0, 1, 0] },
        { inputs: [1, 0, 1, 0, 0, 1, 1, 0], outputs: [0, 0, 1] },
        { inputs: [1, 1, 1, 1, 0, 1, 1, 1], outputs: [1, 0, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P16', color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P8', color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_0_P3', color: '#e53935' }, // IA=B to Vcc
      { from: 'GND_1', to: 'IC_0_P2', color: '#1e88e5' }, // IA<B to GND
      { from: 'GND_2', to: 'IC_0_P4', color: '#1e88e5' }, // IA>B to GND
      { from: 'SW_0', to: 'IC_0_P10', color: '#fbc02d' },
      { from: 'SW_1', to: 'IC_0_P12', color: '#fbc02d' },
      { from: 'SW_2', to: 'IC_0_P13', color: '#fbc02d' },
      { from: 'SW_3', to: 'IC_0_P15', color: '#fbc02d' },
      { from: 'SW_4', to: 'IC_0_P9', color: '#29b6f6' },
      { from: 'SW_5', to: 'IC_0_P11', color: '#29b6f6' },
      { from: 'SW_6', to: 'IC_0_P14', color: '#29b6f6' },
      { from: 'SW_7', to: 'IC_0_P1', color: '#29b6f6' },
      { from: 'IC_0_P5', to: 'LED_0', color: '#00e676' },
      { from: 'IC_0_P6', to: 'LED_1', color: '#ab47bc' },
      { from: 'IC_0_P7', to: 'LED_2', color: '#ff1744' }
    ]
  },

  // ==========================================
  // EXPERIMENT 7: Design and Verification of Flip-Flops
  // ==========================================
  // RS Flip-Flop using IC 7400 (NAND-based)
  {
    id: 'exp7_rs_ff',
    expNum: 7,
    subMode: 'RS_FF',
    title: 'Exp 7: RS Flip-Flop using IC 7400 (NAND)',
    aim: 'To design and construct an RS Flip-Flop using NAND gates (IC 7400) and verify its truth table.',
    apparatus: [
      { name: 'IC 7400', spec: 'Quad 2-Input NAND Gate', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The SR (Set-Reset) Flip-Flop is the most basic memory element. When built from NAND gates, inputs are active LOW:\n• S=0, R=1 → Q=1 (Set state)\n• S=1, R=0 → Q=0 (Reset state)\n• S=1, R=1 → Q holds previous state (Memory / No Change)\n• S=0, R=0 → Forbidden state (Q = Q\' = 1, undefined)\n\nIC 7400 Gate 1 (Pins 1,2,3): NAND Gate for Q output.\nIC 7400 Gate 2 (Pins 4,5,6): NAND Gate for Q\' output.',
    procedure: [
      '1. Insert IC 7400 into Socket 1.',
      '2. Connect Pin 14 to +5V (Vcc) and Pin 7 to GND.',
      '3. RS FF using NAND: Connect SW 0 (S\') to Pin 1 and Pin 6. Connect SW 1 (R\') to Pin 4 and Pin 2.',
      '4. Cross-couple: Connect Pin 3 (Q) to Pin 5; Connect Pin 6 (Q\') to Pin 2.',
      '   NOTE: In simulation use SW 0 → Pin 1 and SW 1 → Pin 4 for S and R respectively.',
      '5. Connect Pin 3 (Q output) to LED 0.',
      '6. Connect Pin 6 (Q\' output) to LED 1.',
      '7. Set SW 0=0 (S active), SW 1=1 (R inactive) → Q=1 (Set).',
      '8. Set SW 0=1 (S inactive), SW 1=0 (R active) → Q=0 (Reset).',
      '9. Set SW 0=1, SW 1=1 → Q holds (No Change / Memory).',
      '10. Set SW 0=0, SW 1=0 → Forbidden state (avoid in practice).'
    ],
    requiredICs: ['7400'],
    defaultSockets: [{ socketId: 0, partNumber: '7400' }],
    inputs: [
      { id: 0, label: "S' (SW 0, active LOW)", switchIndex: 0 },
      { id: 1, label: "R' (SW 1, active LOW)", switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Q (LED 0)',   ledIndex: 0 },
      { id: 1, label: "Q' (LED 1)",  ledIndex: 1 }
    ],
    truthTable: {
      headers: ["S'", "R'", 'Q', "Q'", 'State'],
      rows: [
        { inputs: [0, 1], outputs: [1, 0] },  // Set: Q=1, Q'=0
        { inputs: [1, 0], outputs: [0, 1] },  // Reset: Q=0, Q'=1
        { inputs: [1, 1], outputs: [0, 1] },  // Hold (holds previous Reset state: Q=0, Q'=1)
        { inputs: [0, 0], outputs: [1, 1] }   // Forbidden: Q=1, Q'=1
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // S' → Gate 1 input A
      { from: 'SW_0', to: 'IC_0_P1', color: '#fbc02d' },
      // R' → Gate 2 input A
      { from: 'SW_1', to: 'IC_0_P4', color: '#43a047' },
      // Cross-couple: Q (P3) → Gate 2 input B (P5)
      { from: 'IC_0_P3', to: 'IC_0_P5', color: '#ab47bc' },
      // Cross-couple: Q' (P6) → Gate 1 input B (P2)
      { from: 'IC_0_P6', to: 'IC_0_P2', color: '#00acc1' },
      // Outputs to LEDs
      { from: 'IC_0_P3', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P6', to: 'LED_1', color: '#ff7043' }
    ]
  },

  // D Flip-Flop using IC 7474
  {
    id: 'exp7_d_ff',
    expNum: 7,
    subMode: 'D_FF',
    title: 'Exp 7: D Flip-Flop using IC 7474',
    aim: 'To design and construct a D Flip-Flop using IC 7474 and verify its truth table.',
    apparatus: [
      { name: 'IC 7474', spec: 'Dual D-Type Positive Edge Triggered Flip-Flop', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The D Flip-Flop (Data / Delay Flip-Flop) transfers the value at the D input to the Q output on the rising edge of the clock pulse.\n• CLK↑ → Q = D (output tracks input only on clock edge)\n• PRE = 0 (active LOW): Forces Q = 1 asynchronously\n• CLR = 0 (active LOW): Forces Q = 0 asynchronously\n• When both PRE and CLR are HIGH (inactive), Q latches D on each rising clock edge.\n\nIC 7474 Flip-Flop 1 Pins:\n  CLR=Pin1, D=Pin2, CLK=Pin3, PRE=Pin4, Q=Pin5, Q\'=Pin6',
    procedure: [
      '1. Insert IC 7474 into Socket 1.',
      '2. Connect Pin 14 (VCC) to +5V and Pin 7 (GND) to GND.',
      '3. Connect Pin 4 (1PRE) to +5V (Vcc) — inactive HIGH.',
      '4. Connect Pin 1 (1CLR) to +5V (Vcc) — inactive HIGH.',
      '5. CLOCK (CLK): Connect Function Generator (+) to Pin 3 (1CLK) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 100 Hz, Amplitude = 5V p-p, DC Offset = 2.48V, Waveform = Square.',
      '   In the simulator: Connect SW 0 to Pin 3 (toggling SW 0 simulates one clock pulse).',
      '6. Connect Switch 1 (D input) to Pin 2 (1D).',
      '7. Connect Pin 5 (1Q) to LED 0 and Pin 6 (1Q\') to LED 1.',
      '8. Set D = SW 1 and toggle CLK (SW 0) to observe Q = D on clock edge.'
    ],
    requiredICs: ['7474'],
    defaultSockets: [{ socketId: 0, partNumber: '7474' }],
    functionGenerator: {
      pin: 3,
      socketId: 0,
      frequency: '100 Hz',
      amplitude: '5V p-p',
      dcOffset: '2.48V',
      waveform: 'Square',
      positive: 'IC_0_P3 (1CLK)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (SW 0 / Fn.Gen)', switchIndex: 0 },
      { id: 1, label: 'D (SW 1)',             switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'Q (LED 0)',   ledIndex: 0 },
      { id: 1, label: "Q' (LED 1)", ledIndex: 1 }
    ],
    truthTable: {
      headers: ['CLK', 'D', 'Q', "Q'"],
      rows: [
        { inputs: [1, 0], outputs: [0, 1] },
        { inputs: [1, 1], outputs: [1, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // PRE and CLR tied HIGH (inactive)
      { from: 'VCC', to: 'IC_0_P4',  color: '#e53935' },
      { from: 'VCC', to: 'IC_0_P1',  color: '#e53935' },
      // CLK = SW 0 (simulates function generator clock)
      { from: 'SW_0', to: 'IC_0_P3', color: '#ff7043' },
      // D = SW 1
      { from: 'SW_1', to: 'IC_0_P2', color: '#fbc02d' },
      // Outputs
      { from: 'IC_0_P5', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P6', to: 'LED_1', color: '#ab47bc' }
    ]
  },

  // JK Flip-Flop using IC 7476
  {
    id: 'exp7_jk_ff',
    expNum: 7,
    subMode: 'JK_FF',
    title: 'Exp 7: JK Flip-Flop using IC 7476',
    aim: 'To design and construct a JK Flip-Flop using IC 7476 and verify its truth table.',
    apparatus: [
      { name: 'IC 7476', spec: 'Dual JK Master-Slave Flip-Flop', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The JK Flip-Flop eliminates the undefined state of the RS flip-flop.\n• J=0, K=0, CLK → Q holds (No Change)\n• J=0, K=1, CLK → Q = 0 (Reset)\n• J=1, K=0, CLK → Q = 1 (Set)\n• J=1, K=1, CLK → Q = Q\' (Toggle)\n\nIC 7476 Flip-Flop 1: CLK=Pin1, PRE=Pin2(active LOW), CLR=Pin3(active LOW), J=Pin4, Q=Pin6, Q\'=Pin7, K=Pin8.\nVCC = Pin 5, GND = Pin 13.',
    procedure: [
      '1. Insert IC 7476 into Socket 1.',
      '2. Connect Pin 5 (VCC) to +5V and Pin 13 (GND) to GND.',
      '3. Connect Pin 2 (1PRE) and Pin 3 (1CLR) to +5V (Vcc) — both inactive HIGH.',
      '4. CLOCK (CLK): Connect Function Generator (+) to Pin 1 (1CLK) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 100 Hz, Amplitude = 5V p-p, DC Offset = 2.48V, Waveform = Square.',
      '   In the simulator: Connect SW 0 to Pin 1 (1CLK).',
      '5. Connect Switch 1 (J input) to Pin 4 (1J).',
      '6. Connect Switch 2 (K input) to Pin 8 (1K).',
      '7. Connect Pin 6 (1Q) to LED 0 and Pin 7 (1Q\') to LED 1.',
      '8. Verify all four JK combinations (00, 01, 10, 11) while clocking.'
    ],
    requiredICs: ['7476'],
    defaultSockets: [{ socketId: 0, partNumber: '7476' }],
    functionGenerator: {
      pin: 1,
      socketId: 0,
      frequency: '100 Hz',
      amplitude: '5V p-p',
      dcOffset: '2.48V',
      waveform: 'Square',
      positive: 'IC_0_P1 (1CLK)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (Fn.Gen / SW 0)', switchIndex: 0 },
      { id: 1, label: 'J (SW 1)',             switchIndex: 1 },
      { id: 2, label: 'K (SW 2)',             switchIndex: 2 }
    ],
    outputs: [
      { id: 0, label: 'Q (LED 0)',   ledIndex: 0 },
      { id: 1, label: "Q' (LED 1)", ledIndex: 1 }
    ],
    truthTable: {
      headers: ['CLK', 'J', 'K', 'Q (next)', "Q' (next)"],
      rows: [
        { inputs: [1, 0, 1], outputs: [0, 1] },  // Reset
        { inputs: [1, 0, 0], outputs: [0, 1] },  // Hold (0)
        { inputs: [1, 1, 0], outputs: [1, 0] },  // Set
        { inputs: [1, 0, 0], outputs: [1, 0] },  // Hold (1)
        { inputs: [1, 1, 1], outputs: [0, 1] },  // Toggle (1→0)
        { inputs: [1, 1, 1], outputs: [1, 0] }   // Toggle (0→1)
      ]
    },
    referenceWiring: [
      // VCC = Pin 5, GND = Pin 13 for 7476
      { from: 'VCC_0', to: 'IC_0_P5',  color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P13', color: '#1e88e5' },
      // PRE and CLR tied HIGH (inactive)
      { from: 'VCC_1', to: 'IC_0_P2', color: '#e53935' },
      { from: 'VCC_2', to: 'IC_0_P3', color: '#e53935' },
      // Function Generator Clock: (+) -> Pin 1, (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P1',  color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_1',    color: '#1e88e5' },
      // J = SW 1
      { from: 'SW_1', to: 'IC_0_P4',  color: '#fbc02d' },
      // K = SW 2 (Pin 16 in TI 7476 / SRM Manual)
      { from: 'SW_2', to: 'IC_0_P16', color: '#43a047' },
      // Outputs: Pin 15 (1Q), Pin 14 (1Q')
      { from: 'IC_0_P15', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P14', to: 'LED_1', color: '#ab47bc' }
    ]
  },

  // T Flip-Flop using IC 7476 (JK with J=K=1)
  {
    id: 'exp7_t_ff',
    expNum: 7,
    subMode: 'T_FF',
    title: 'Exp 7: T Flip-Flop using IC 7476 (JK with J=K=Vcc)',
    aim: 'To construct a T (Toggle) Flip-Flop from IC 7476 by tying J = K = 1 and verify its toggle behavior.',
    apparatus: [
      { name: 'IC 7476', spec: 'Dual JK Master-Slave Flip-Flop', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A T Flip-Flop is obtained from a JK Flip-Flop by permanently tying both J and K inputs HIGH (to Vcc = logic 1).\n• With J = K = 1, on every active clock edge: Q toggles (flips).\n• Q(next) = Q\'(present)\nThis makes it useful as a frequency divider: the Q output is exactly half the input clock frequency.\nIC 7476 Flip-Flop 1: CLK=Pin1, PRE=Pin2(active LOW), CLR=Pin3(active LOW), J=Pin4 → Vcc, Q=Pin15, Q\'=Pin14, K=Pin16 → Vcc.',
    procedure: [
      '1. Insert IC 7476 into Socket 1.',
      '2. Connect Pin 5 (VCC) to +5V and Pin 13 (GND) to GND.',
      '3. Connect Pin 2 (1PRE) and Pin 3 (1CLR) to +5V (inactive HIGH).',
      '4. Connect J (Pin 4) to +5V and K (Pin 16) to +5V — tie both inputs HIGH permanently.',
      '5. CLOCK (CLK): Connect Function Generator (+) to Pin 1 (1CLK) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 100 Hz, Amplitude = 5V p-p, DC Offset = 2.48V, Waveform = Square.',
      '   In the simulator: Connect FG_POS to Pin 1 (1CLK) and FG_NEG to GND.',
      '6. Connect Pin 15 (1Q) to LED 0 and Pin 14 (1Q\') to LED 1.',
      '7. Toggle clock repeatedly and observe LED 0 changing state each time — confirming toggle behavior.'
    ],
    requiredICs: ['7476'],
    defaultSockets: [{ socketId: 0, partNumber: '7476' }],
    functionGenerator: {
      pin: 1,
      socketId: 0,
      frequency: '100 Hz',
      amplitude: '5V p-p',
      dcOffset: '2.48V',
      waveform: 'Square',
      positive: 'IC_0_P1 (1CLK)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (Fn.Gen / SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 0, label: 'Q (LED 0)',   ledIndex: 0 },
      { id: 1, label: "Q' (LED 1)", ledIndex: 1 }
    ],
    truthTable: {
      headers: ['CLK', 'J (tied 1)', 'K (tied 1)', 'Q (next)', "Q' (next)"],
      rows: [
        { inputs: [1], outputs: [1, 0] },  // Toggle: 0→1
        { inputs: [1], outputs: [0, 1] },  // Toggle: 1→0
        { inputs: [1], outputs: [1, 0] }   // Toggle: 0→1
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P5',  color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P13', color: '#1e88e5' },
      // PRE, CLR, J, K → all HIGH
      { from: 'VCC_1', to: 'IC_0_P2',  color: '#e53935' },
      { from: 'VCC_2', to: 'IC_0_P3',  color: '#e53935' },
      { from: 'VCC_3', to: 'IC_0_P4',  color: '#e53935' },  // J = 1
      { from: 'VCC_4', to: 'IC_0_P16', color: '#e53935' },  // K = 1
      // Function Generator Clock: (+) -> Pin 1, (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P1', color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_1',   color: '#1e88e5' },
      // Outputs
      { from: 'IC_0_P15', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P14', to: 'LED_1', color: '#ab47bc' }
    ]
  },

  // ==========================================
  // EXPERIMENT 8: Johnson and Ring Counters
  // ==========================================
  {
    id: 'exp8_ring_counter',
    expNum: 8,
    subMode: 'RingCounter',
    title: 'Exp 8: 3-Bit Ring Counter using IC 7474',
    aim: 'To design and verify the truth table of a 3-bit Ring Counter using IC 7474.',
    apparatus: [
      { name: 'IC 7474', spec: 'Dual D-Type Positive Edge Triggered Flip-Flop', qty: 2 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A Ring Counter is a circular shift register where the output of the last flip-flop feeds back as input to the first flip-flop. Only one flip-flop is HIGH (1) at any time, and this logic 1 circulates around the ring.\n\nFor a 3-bit ring counter using three D Flip-Flops:\n• Clock 0: Q2 Q1 Q0 = 0 0 1 (Initial state initialized with Q0=1)\n• Clock 1: Q2 Q1 Q0 = 0 1 0\n• Clock 2: Q2 Q1 Q0 = 1 0 0\n• Clock 3: Q2 Q1 Q0 = 0 0 1 (repeats)\n\nAll flip-flops share the same CLK. The Q output of FF(n) is connected to D input of FF(n+1). Last FF Q output connects back to FF0 D input.',
    procedure: [
      '1. Insert two IC 7474 ICs (Socket 1 and Socket 2).',
      '2. Connect VCC (Pin 14) and GND (Pin 7) for both ICs.',
      '3. CLOCK: Connect Function Generator (+) to Pin 3 (1CLK) of IC1, Pin 11 (2CLK) of IC1, and Pin 3 (1CLK) of IC2. Connect Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 100 Hz, Amplitude = 5V p-p, DC Offset = 2.48V, Waveform = Square.',
      '   In the simulator: Connect FG_POS to all three CLK pins, and FG_NEG to GND.',
      '4. All PRE and CLR pins tie to Vcc (inactive). FF0 is preset so Q0 starts at 1.',
      '5. Connect Q0 (IC1 P5) → D1 (IC1 P12). Connect Q1 (IC1 P9) → D2 (IC2 P2). Connect Q2 (IC2 P5) → D0 (IC1 P2) — ring feedback.',
      '6. Connect Q0 → LED 0, Q1 → LED 1, Q2 → LED 2.',
      '7. Apply clock pulses and verify LEDs cycle: 100 → 010 → 001 → 100...'
    ],
    requiredICs: ['7474', '7474'],
    defaultSockets: [
      { socketId: 0, partNumber: '7474' },
      { socketId: 1, partNumber: '7474' }
    ],
    initialState: {
      0: { q1: 1, q2: 0 },
      1: { q1: 0 }
    },
    functionGenerator: {
      frequency: '100 Hz',
      amplitude: '5V p-p',
      dcOffset: '2.48V',
      waveform: 'Square',
      positive: 'IC_0_P3 (CLK — all FF clock pins tied together)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (Fn.Gen / SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 0, label: 'Q0 (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Q1 (LED 1)', ledIndex: 1 },
      { id: 2, label: 'Q2 (LED 2)', ledIndex: 2 }
    ],
    truthTable: {
      headers: ['CLK Pulse', 'Q0', 'Q1', 'Q2'],
      rows: [
        { inputs: [0], outputs: [1, 0, 0] },  // Initial state (Q0=1)
        { inputs: [1], outputs: [0, 1, 0] },  // Pulse 1: Q1=1
        { inputs: [2], outputs: [0, 0, 1] },  // Pulse 2: Q2=1
        { inputs: [3], outputs: [1, 0, 0] }   // Pulse 3: repeats
      ]
    },
    referenceWiring: [
      // IC1 (Socket 0) = FF0 and FF1
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // IC2 (Socket 1) = FF2
      { from: 'VCC_1', to: 'IC_1_P14', color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P7',  color: '#1e88e5' },
      // All PRE / CLR inactive (tied HIGH)
      { from: 'VCC_2', to: 'IC_0_P4',  color: '#e53935' },
      { from: 'VCC_3', to: 'IC_0_P1',  color: '#e53935' },
      { from: 'VCC_4', to: 'IC_0_P10', color: '#e53935' },
      { from: 'VCC_5', to: 'IC_0_P13', color: '#e53935' },
      { from: 'VCC_6', to: 'IC_1_P4',  color: '#e53935' },
      { from: 'VCC_7', to: 'IC_1_P1',  color: '#e53935' },
      // Function Generator Clock: (+) -> all three FF clocks, (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P3',  color: '#ff7043' },
      { from: 'FG_POS', to: 'IC_0_P11', color: '#ff7043' },
      { from: 'FG_POS', to: 'IC_1_P3',  color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_2',    color: '#1e88e5' },
      // Ring feedback: Q0 (IC0 P5) → D1 (IC0 P12), Q1 (IC0 P9) → D2 (IC1 P2), Q2 (IC1 P5) → D0 (IC0 P2)
      { from: 'IC_0_P5', to: 'IC_0_P12', color: '#fbc02d' },
      { from: 'IC_0_P9', to: 'IC_1_P2',  color: '#43a047' },
      { from: 'IC_1_P5', to: 'IC_0_P2',  color: '#29b6f6' },
      // Outputs to LEDs
      { from: 'IC_0_P5', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P9', to: 'LED_1', color: '#ab47bc' },
      { from: 'IC_1_P5', to: 'LED_2', color: '#ffa726' }
    ]
  },

  {
    id: 'exp8_johnson_counter',
    expNum: 8,
    subMode: 'JohnsonCounter',
    title: 'Exp 8: 3-Bit Johnson Counter using IC 7474',
    aim: 'To design and verify the truth table of a 3-bit Johnson (Switch-Tail Ring) Counter using IC 7474.',
    apparatus: [
      { name: 'IC 7474', spec: 'Dual D-Type Positive Edge Triggered Flip-Flop', qty: 2 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'A Johnson Counter (Twisted Ring / Mobius Counter) is a modified ring counter where the COMPLEMENT output Q\' of the last flip-flop is fed back to the D input of the first flip-flop.\n\nFor a 3-bit Johnson Counter:\n• State 0 (CLK 0): Q0 Q1 Q2 = 0 0 0\n• State 1 (CLK 1): Q0 Q1 Q2 = 1 0 0\n• State 2 (CLK 2): Q0 Q1 Q2 = 1 1 0\n• State 3 (CLK 3): Q0 Q1 Q2 = 1 1 1\n• State 4 (CLK 4): Q0 Q1 Q2 = 0 1 1\n• State 5 (CLK 5): Q0 Q1 Q2 = 0 0 1\n• Then back to 0 0 0 (cycle length = 2N = 6).\n\nKey difference from ring counter: Q\'(last) → D(first) instead of Q(last) → D(first).',
    procedure: [
      '1. Insert two IC 7474 ICs (Socket 1 and Socket 2).',
      '2. Connect VCC (Pin 14) and GND (Pin 7) for both ICs.',
      '3. CLOCK: Connect Function Generator (+) to all CLK pins. Connect Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 100 Hz, Amplitude = 5V p-p, DC Offset = 2.48V, Waveform = Square.',
      '   In the simulator: Connect FG_POS to all CLK pins, and FG_NEG to GND.',
      '4. All PRE and CLR → Vcc (inactive). All FFs clear to 0 initially.',
      '5. Connect Q0 → D1 (IC1 P5→IC1 P12), Q1 → D2 (IC1 P9→IC2 P2).',
      '6. TWIST: Connect Q2\' (IC2 Pin 6) → D0 (IC1 Pin 2) — this is the Johnson counter twist.',
      '7. Connect Q0→LED0, Q1→LED1, Q2→LED2.',
      '8. Apply clock pulses and verify: 000→100→110→111→011→001→000.'
    ],
    requiredICs: ['7474', '7474'],
    defaultSockets: [
      { socketId: 0, partNumber: '7474' },
      { socketId: 1, partNumber: '7474' }
    ],
    initialState: {
      0: { q1: 0, q2: 0 },
      1: { q1: 0 }
    },
    functionGenerator: {
      frequency: '100 Hz',
      amplitude: '5V p-p',
      dcOffset: '2.48V',
      waveform: 'Square',
      positive: 'IC_0_P3 (CLK — all FF clock pins tied together)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (Fn.Gen / SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 0, label: 'Q0 (LED 0)', ledIndex: 0 },
      { id: 1, label: 'Q1 (LED 1)', ledIndex: 1 },
      { id: 2, label: 'Q2 (LED 2)', ledIndex: 2 }
    ],
    truthTable: {
      headers: ['CLK Pulse', 'Q0', 'Q1', 'Q2'],
      rows: [
        { inputs: [0], outputs: [0, 0, 0] },
        { inputs: [1], outputs: [1, 0, 0] },
        { inputs: [2], outputs: [1, 1, 0] },
        { inputs: [3], outputs: [1, 1, 1] },
        { inputs: [4], outputs: [0, 1, 1] },
        { inputs: [5], outputs: [0, 0, 1] },
        { inputs: [6], outputs: [0, 0, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC',   to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND',   to: 'IC_0_P7',  color: '#1e88e5' },
      { from: 'VCC_1', to: 'IC_1_P14', color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P7',  color: '#1e88e5' },
      // PRE / CLR inactive
      { from: 'VCC_2', to: 'IC_0_P4',  color: '#e53935' },
      { from: 'VCC_3', to: 'IC_0_P1',  color: '#e53935' },
      { from: 'VCC_4', to: 'IC_0_P10', color: '#e53935' },
      { from: 'VCC_5', to: 'IC_0_P13', color: '#e53935' },
      { from: 'VCC_6', to: 'IC_1_P4',  color: '#e53935' },
      { from: 'VCC_7', to: 'IC_1_P1',  color: '#e53935' },
      // Shared CLK from Function Generator
      { from: 'FG_POS', to: 'IC_0_P3',  color: '#ff7043' },
      { from: 'FG_POS', to: 'IC_0_P11', color: '#ff7043' },
      { from: 'FG_POS', to: 'IC_1_P3',  color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_2',    color: '#1e88e5' },
      // Shift chain: Q0→D1, Q1→D2
      { from: 'IC_0_P5', to: 'IC_0_P12', color: '#fbc02d' },
      { from: 'IC_0_P9', to: 'IC_1_P2',  color: '#43a047' },
      // TWIST: Q2' (IC1 P6) → D0 (IC0 P2)
      { from: 'IC_1_P6', to: 'IC_0_P2',  color: '#f06292' },
      // Outputs
      { from: 'IC_0_P5', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P9', to: 'LED_1', color: '#ab47bc' },
      { from: 'IC_1_P5', to: 'LED_2', color: '#ffa726' }
    ]
  },

  // ==========================================
  // EXPERIMENT 9: 3-Bit Synchronous Counter
  // ==========================================
  {
    id: 'exp9_sync_counter',
    expNum: 9,
    subMode: 'SyncCounter',
    title: 'Exp 9: 3-Bit Synchronous Counter (IC 7476 + IC 7408)',
    aim: 'To design and construct a 3-bit Synchronous Counter using IC 7476 (JK flip-flops) and IC 7408 (AND gate), and verify its truth table.',
    apparatus: [
      { name: 'IC 7476', spec: 'Dual JK Master-Slave Flip-Flop', qty: 2 },
      { name: 'IC 7408', spec: 'Quad 2-Input AND Gate', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'In a synchronous counter, all flip-flops share the same clock signal and change state simultaneously. This eliminates the propagation delay glitches seen in ripple (asynchronous) counters.\n\nFor a 3-bit binary synchronous UP counter using JK flip-flops:\n• FF0 (LSB QA): J0 = K0 = 1 (always toggles on every CLK)\n• FF1 (QB): J1 = K1 = QA (toggles only when QA = 1)\n• FF2 (MSB QC): J2 = K2 = QA · QB (toggles when both QA=1 AND QB=1)\n\nThe AND gate computes QA · QB for the MSB flip-flop.\n\nIC 7476 VCC = Pin 5, GND = Pin 13.\nIC 7408 VCC = Pin 14, GND = Pin 7.',
    procedure: [
      '1. Insert IC 7476 (Socket 1), second IC 7476 (Socket 2), and IC 7408 (Socket 3).',
      '2. Connect Pin 5 to VCC and Pin 13 to GND for both 7476 ICs.',
      '3. Connect Pin 14 to VCC and Pin 7 to GND for IC 7408.',
      '4. All PRE and CLR pins of all JK FFs connect to +5V (inactive HIGH).',
      '5. CLOCK: Connect Function Generator (+) to Pin 1 (1CLK) of IC1-7476, Pin 15 (2CLK) of IC1-7476, and Pin 1 (1CLK) of IC2-7476. Connect Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 1 Hz, Amplitude = 5V p-p, DC Offset = 2V, Waveform = Square.',
      '   In the simulator: Connect SW 0 to all three CLK pins.',
      '6. FF-A (IC1 FF1): J=K=Vcc. QA = Pin 6. CLK = Pin 1.',
      '7. FF-B (IC1 FF2): J=K=QA (Pin 6 of FF-A → Pin 11 and Pin 12 of IC1). QB = Pin 9. CLK = Pin 15.',
      '8. For FF-C (IC2 FF1): J=K = AND(QA,QB). Connect QA (IC1 P6) → AND Gate Pin1, QB (IC1 P9) → AND Gate Pin2. AND output (Pin3) → IC2 J (Pin4) and IC2 K (Pin8).',
      '9. Connect QA→LED0, QB→LED1, QC→LED2.',
      '10. Apply clock pulses; counter should count 000→001→010→011→100→101→110→111→000.'
    ],
    requiredICs: ['7476', '7476', '7408'],
    defaultSockets: [
      { socketId: 0, partNumber: '7476' },
      { socketId: 1, partNumber: '7476' },
      { socketId: 2, partNumber: '7408' }
    ],
    functionGenerator: {
      frequency: '1 Hz',
      amplitude: '5V p-p',
      dcOffset: '2V',
      waveform: 'Square',
      positive: 'IC_0_P1 (1CLK of FF-A — all CLK pins tied together)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (Fn.Gen / SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 0, label: 'QA (LED 0)', ledIndex: 0 },
      { id: 1, label: 'QB (LED 1)', ledIndex: 1 },
      { id: 2, label: 'QC (LED 2)', ledIndex: 2 }
    ],
    truthTable: {
      headers: ['CLK Pulse', 'QA', 'QB', 'QC'],
      rows: [
        { inputs: [0], outputs: [0, 0, 0] },
        { inputs: [1], outputs: [1, 0, 0] },
        { inputs: [2], outputs: [0, 1, 0] },
        { inputs: [3], outputs: [1, 1, 0] },
        { inputs: [4], outputs: [0, 0, 1] },
        { inputs: [5], outputs: [1, 0, 1] },
        { inputs: [6], outputs: [0, 1, 1] },
        { inputs: [7], outputs: [1, 1, 1] },
        { inputs: [8], outputs: [0, 0, 0] }
      ]
    },
    referenceWiring: [
      // IC1 7476 (Socket 0): VCC=P5, GND=P13
      { from: 'VCC_0', to: 'IC_0_P5',  color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P13', color: '#1e88e5' },
      // IC2 7476 (Socket 1): VCC=P5, GND=P13
      { from: 'VCC_1', to: 'IC_1_P5',  color: '#e53935' },
      { from: 'GND_1', to: 'IC_1_P13', color: '#1e88e5' },
      // IC3 7408 (Socket 2): VCC=P14, GND=P7
      { from: 'VCC_2', to: 'IC_2_P14', color: '#e53935' },
      { from: 'GND_2', to: 'IC_2_P7',  color: '#1e88e5' },
      // All PRE/CLR inactive (tied to Vcc)
      { from: 'VCC_3', to: 'IC_0_P2',  color: '#e53935' },
      { from: 'VCC_4', to: 'IC_0_P3',  color: '#e53935' },
      { from: 'VCC_5', to: 'IC_0_P7',  color: '#e53935' },
      { from: 'VCC_6', to: 'IC_0_P8',  color: '#e53935' },
      { from: 'VCC_7', to: 'IC_1_P2',  color: '#e53935' },
      { from: 'VCC',   to: 'IC_1_P3',  color: '#e53935' },
      // Function Generator Clock: (+) -> IC0 P1, IC0 P6, IC1 P1; (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P1', color: '#ff7043' },
      { from: 'FG_POS', to: 'IC_0_P6', color: '#ff7043' },
      { from: 'FG_POS', to: 'IC_1_P1', color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_3',   color: '#1e88e5' },
      // FF-A: J=K=Vcc (always toggles)
      { from: 'VCC',  to: 'IC_0_P4',   color: '#e53935' },
      { from: 'VCC',  to: 'IC_0_P16',  color: '#e53935' },
      // FF-B: J=K=QA (IC0 P15 → IC0 P9 and P12)
      { from: 'IC_0_P15', to: 'IC_0_P9',  color: '#fbc02d' },
      { from: 'IC_0_P15', to: 'IC_0_P12', color: '#fbc02d' },
      // AND Gate: QA·QB → J,K of FF-C
      { from: 'IC_0_P15', to: 'IC_2_P1', color: '#fbc02d' },
      { from: 'IC_0_P11', to: 'IC_2_P2', color: '#43a047' },
      { from: 'IC_2_P3',  to: 'IC_1_P4', color: '#ab47bc' },
      { from: 'IC_2_P3',  to: 'IC_1_P16', color: '#ab47bc' },
      // Outputs
      { from: 'IC_0_P15', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P11', to: 'LED_1', color: '#29b6f6' },
      { from: 'IC_1_P15', to: 'LED_2', color: '#ffa726' }
    ]
  },

  // ==========================================
  // EXPERIMENT 10: Decade Counter using IC 7490
  // ==========================================
  {
    id: 'exp10_decade_counter',
    expNum: 10,
    subMode: 'DecadeCounter',
    title: 'Exp 10: Decade Counter using IC 7490 (74LS90)',
    aim: 'To construct and verify the working of a BCD Decade Counter using IC 7490.',
    apparatus: [
      { name: 'IC 7490', spec: 'Decade Counter (Divide-by-2 and Divide-by-5)', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'The IC 7490 is a monolithic decade counter consisting of four master-slave flip-flops. It counts from 0 to 9 (BCD) and then resets to 0 on the next clock pulse.\n\nIC 7490 Pinout:\n• VCC = Pin 5, GND = Pin 10\n• CKA (CLK A) = Pin 14, CKB (CLK B) = Pin 1\n• QA = Pin 12, QB = Pin 9, QC = Pin 8, QD = Pin 11\n• R0(1)=Pin2, R0(2)=Pin3: Both HIGH → resets count to 0000\n• R9(1)=Pin6, R9(2)=Pin7: Both HIGH → resets count to 1001 (decimal 9)\n\nFor a BCD decade count: Connect QA output (Pin 12) externally to CKB (Pin 1). Apply 1 Hz clock to CKA (Pin 14). Tie both reset pins R0(1) and R0(2) to GND for normal counting.',
    procedure: [
      '1. Insert IC 7490 into Socket 1.',
      '2. Connect Pin 5 (VCC) to +5V and Pin 10 (GND) to GND.',
      '3. Connect Reset pins: R0(1)=Pin2 → GND, R0(2)=Pin3 → GND (disable reset-to-0).',
      '4. Connect R9(1)=Pin6 → GND, R9(2)=Pin7 → GND (disable reset-to-9).',
      '5. For BCD counting: Connect QA (Pin 12) → CKB (Pin 1) externally.',
      '6. CLOCK: Connect Function Generator (+) to Pin 14 (CKA) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 1 Hz, Amplitude = 5V p-p, DC Offset = 2V, Waveform = Square.',
      '   In the simulator: Connect SW 0 to Pin 14 (CKA).',
      '7. Connect QA (Pin 12) → LED 0, QB (Pin 9) → LED 1, QC (Pin 8) → LED 2, QD (Pin 11) → LED 3.',
      '8. Apply clock pulses and record the BCD outputs for each clock cycle (0000 to 1001 then reset).'
    ],
    requiredICs: ['7490'],
    defaultSockets: [{ socketId: 0, partNumber: '7490' }],
    functionGenerator: {
      pin: 14,
      socketId: 0,
      frequency: '1 Hz',
      amplitude: '5V p-p',
      dcOffset: '2V',
      waveform: 'Square',
      positive: 'IC_0_P14 (CKA)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK / CKA (Fn.Gen / SW 0)', switchIndex: 0 }
    ],
    outputs: [
      { id: 0, label: 'QA (LED 0)', ledIndex: 0 },
      { id: 1, label: 'QB (LED 1)', ledIndex: 1 },
      { id: 2, label: 'QC (LED 2)', ledIndex: 2 },
      { id: 3, label: 'QD (LED 3)', ledIndex: 3 }
    ],
    truthTable: {
      headers: ['CLK Pulse', 'QA', 'QB', 'QC', 'QD', 'Decimal'],
      rows: [
        { inputs: [0], outputs: [0, 0, 0, 0] },
        { inputs: [1], outputs: [1, 0, 0, 0] },
        { inputs: [2], outputs: [0, 1, 0, 0] },
        { inputs: [3], outputs: [1, 1, 0, 0] },
        { inputs: [4], outputs: [0, 0, 1, 0] },
        { inputs: [5], outputs: [1, 0, 1, 0] },
        { inputs: [6], outputs: [0, 1, 1, 0] },
        { inputs: [7], outputs: [1, 1, 1, 0] },
        { inputs: [8], outputs: [0, 0, 0, 1] },
        { inputs: [9], outputs: [1, 0, 0, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC_0', to: 'IC_0_P5',  color: '#e53935' },
      { from: 'GND_0', to: 'IC_0_P10', color: '#1e88e5' },
      // Reset pins tied to GND (normal counting mode)
      { from: 'GND_1', to: 'IC_0_P2',  color: '#1e88e5' },
      { from: 'GND_2', to: 'IC_0_P3',  color: '#1e88e5' },
      { from: 'GND_3', to: 'IC_0_P6',  color: '#1e88e5' },
      { from: 'GND_4', to: 'IC_0_P7',  color: '#1e88e5' },
      // QA (P12) → CKB (P1) for BCD decade counting
      { from: 'IC_0_P12', to: 'IC_0_P1', color: '#ffa726' },
      // Function Generator Clock: (+) -> Pin 14 (CKA), (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P14', color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_5',    color: '#1e88e5' },
      // Outputs to LEDs
      { from: 'IC_0_P12', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P9',  to: 'LED_1', color: '#29b6f6' },
      { from: 'IC_0_P8',  to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P11', to: 'LED_3', color: '#ffa726' }
    ]
  },

  // ==========================================
  // EXPERIMENT 11: Universal Shift Register (IC 7495)
  // ==========================================
  {
    id: 'exp11_sipo',
    expNum: 11,
    subMode: 'SIPO',
    title: 'Exp 11: Shift Register — SIPO (Serial In, Parallel Out) using IC 7495',
    aim: 'To study the Serial-In Parallel-Out (SIPO) mode of a Universal Shift Register using IC 7495.',
    apparatus: [
      { name: 'IC 7495', spec: '4-Bit Right/Left Universal Shift Register', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'IC 7495 is a 4-bit shift register with both serial and parallel inputs and outputs.\n\nSIPO (Serial In Parallel Out) — Right Shift Mode:\n• Mode Control (Pin 6) = 0 (LOW) selects serial/right-shift mode.\n• Data is applied serially at SER input (Pin 1), and shifted right on each rising edge of CLK1 (Pin 9).\n• After 4 clock pulses, all 4 bits are available simultaneously at QA, QB, QC, QD (Pins 13, 12, 11, 10).\n\nIC 7495 Pins:\n• SER (Serial In) = Pin 1\n• Parallel Inputs A-D = Pins 2,3,4,5\n• MODE = Pin 6 (0 = serial, 1 = parallel)\n• CLK1 (Serial Clock) = Pin 9\n• CLK2 (Parallel Clock) = Pin 8\n• QA, QB, QC, QD (Outputs) = Pins 13, 12, 11, 10\n• VCC = Pin 14, GND = Pin 7',
    procedure: [
      '1. Insert IC 7495 into Socket 1.',
      '2. Connect Pin 14 (VCC) to +5V and Pin 7 (GND) to GND.',
      '3. Set Mode (Pin 6) to GND (Mode = 0: Serial Right-Shift mode).',
      '4. Connect Switch 1 (SW 1) to Pin 1 (SER — Serial Input Data).',
      '5. CLOCK (CLK1): Connect Function Generator (+) to Pin 9 (CLK1) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 1 Hz, Amplitude = 5V p-p, DC Offset = 2V, Waveform = Square.',
      '   In the simulator: Connect FG_POS to Pin 9 (CLK1) and FG_NEG to GND.',
      '6. Connect QA (Pin 13) → LED 0, QB (Pin 12) → LED 1, QC (Pin 11) → LED 2, QD (Pin 10) → LED 3.',
      '7. Set serial data (SW 1) to desired bit value (0 or 1) and clock for each bit.',
      '8. After 4 clock pulses, read the 4-bit data from LEDs 0–3.'
    ],
    requiredICs: ['7495'],
    defaultSockets: [{ socketId: 0, partNumber: '7495' }],
    functionGenerator: {
      pin: 9,
      socketId: 0,
      frequency: '1 Hz',
      amplitude: '5V p-p',
      dcOffset: '2V',
      waveform: 'Square',
      positive: 'IC_0_P9 (CLK1)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK1 (Fn.Gen / SW 0)', switchIndex: 0 },
      { id: 1, label: 'SER Data (SW 1)',       switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'QA (LED 0)', ledIndex: 0 },
      { id: 1, label: 'QB (LED 1)', ledIndex: 1 },
      { id: 2, label: 'QC (LED 2)', ledIndex: 2 },
      { id: 3, label: 'QD (LED 3)', ledIndex: 3 }
    ],
    truthTable: {
      headers: ['CLK#', 'SER In', 'QA', 'QB', 'QC', 'QD'],
      rows: [
        { inputs: [1, 0], outputs: [0, 0, 0, 0] },
        { inputs: [1, 1], outputs: [1, 0, 0, 0] },
        { inputs: [1, 1], outputs: [1, 1, 0, 0] },
        { inputs: [1, 1], outputs: [1, 1, 1, 0] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // MODE = 0 (Serial mode)
      { from: 'GND_1', to: 'IC_0_P6', color: '#1e88e5' },
      // Function Generator Clock: (+) -> Pin 9 (CLK1), (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P9', color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_2',   color: '#1e88e5' },
      // SER = SW 1
      { from: 'SW_1', to: 'IC_0_P1',  color: '#fbc02d' },
      // Outputs
      { from: 'IC_0_P13', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P12', to: 'LED_1', color: '#29b6f6' },
      { from: 'IC_0_P11', to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P10', to: 'LED_3', color: '#ffa726' }
    ]
  },

  {
    id: 'exp11_siso',
    expNum: 11,
    subMode: 'SISO',
    title: 'Exp 11: Shift Register — SISO (Serial In, Serial Out) using IC 7495',
    aim: 'To study the Serial-In Serial-Out (SISO) mode of a Universal Shift Register using IC 7495.',
    apparatus: [
      { name: 'IC 7495', spec: '4-Bit Right/Left Universal Shift Register', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'SISO (Serial In Serial Out) Mode:\n• Mode Control (Pin 6) = 0 (LOW).\n• Data bits d0..d3 are entered serially on each rising edge of CLK1 (Pin 9).\n• At the end of the 4th clock pulse, the first data bit d0 appears at QD (Pin 10).\n• Successive clock pulses shift d1, d2, d3 out at QD serially.',
    procedure: [
      '1. Insert IC 7495 into Socket 1.',
      '2. Connect Pin 14 (VCC) to +5V and Pin 7 (GND) to GND.',
      '3. Connect Mode (Pin 6) to GND (Mode = 0: Serial shift mode).',
      '4. Connect SW 1 to Pin 1 (SER).',
      '5. Connect Function Generator (+) to Pin 9 (CLK1) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 1 Hz, Amplitude = 5V p-p, DC Offset = 2V, Waveform = Square.',
      '6. Connect QD (Pin 10) to LED 3 (Serial Output), and QA..QC to LEDs 0..2.',
      '7. Enter 4 bits serially, then observe data bits emerging one by one at QD.'
    ],
    requiredICs: ['7495'],
    defaultSockets: [{ socketId: 0, partNumber: '7495' }],
    functionGenerator: {
      pin: 9,
      socketId: 0,
      frequency: '1 Hz',
      amplitude: '5V p-p',
      dcOffset: '2V',
      waveform: 'Square',
      positive: 'IC_0_P9 (CLK1)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK1 (Fn.Gen / SW 0)', switchIndex: 0 },
      { id: 1, label: 'SER Data (SW 1)',       switchIndex: 1 }
    ],
    outputs: [
      { id: 0, label: 'QA (LED 0)', ledIndex: 0 },
      { id: 1, label: 'QB (LED 1)', ledIndex: 1 },
      { id: 2, label: 'QC (LED 2)', ledIndex: 2 },
      { id: 3, label: 'QD / Serial Out (LED 3)', ledIndex: 3 }
    ],
    truthTable: {
      headers: ['CLK#', 'SER In', 'QA', 'QB', 'QC', 'QD (Serial Out)'],
      rows: [
        { inputs: [1, 0], outputs: [0, 0, 0, 0] },
        { inputs: [1, 1], outputs: [1, 0, 0, 0] },
        { inputs: [1, 1], outputs: [1, 1, 0, 0] },
        { inputs: [1, 1], outputs: [1, 1, 1, 0] },  // d0=0 at QD
        { inputs: [1, 0], outputs: [0, 1, 1, 1] },  // d1=1 at QD
        { inputs: [1, 0], outputs: [0, 0, 1, 1] },  // d2=1 at QD
        { inputs: [1, 0], outputs: [0, 0, 0, 1] }   // d3=1 at QD
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // MODE = 0 (Serial mode)
      { from: 'GND_1', to: 'IC_0_P6', color: '#1e88e5' },
      // Function Generator Clock: (+) -> Pin 9 (CLK1), (-) -> GND
      { from: 'FG_POS', to: 'IC_0_P9', color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_2',   color: '#1e88e5' },
      // SER = SW 1
      { from: 'SW_1', to: 'IC_0_P1',  color: '#fbc02d' },
      // Outputs
      { from: 'IC_0_P13', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P12', to: 'LED_1', color: '#29b6f6' },
      { from: 'IC_0_P11', to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P10', to: 'LED_3', color: '#ffa726' }
    ]
  },

  {
    id: 'exp11_piso',
    expNum: 11,
    subMode: 'PISO',
    title: 'Exp 11: Shift Register — PISO (Parallel In, Serial Out) using IC 7495',
    aim: 'To study the Parallel-In Serial-Out (PISO) mode of IC 7495.',
    apparatus: [
      { name: 'IC 7495', spec: '4-Bit Right/Left Universal Shift Register', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'PISO (Parallel In Serial Out) Mode:\n1. Load Phase: Mode = 1 (HIGH), apply CLK2 pulse. 4-bit data at A,B,C,D (Pins 2,3,4,5) is loaded in parallel into QA,QB,QC,QD simultaneously.\n2. Shift Phase: Set Mode = 0 (LOW), apply CLK1 pulses. Data shifts out serially from QD (Pin 10) one bit per clock cycle.\n\nThis allows converting a 4-bit parallel word into a serial stream.',
    procedure: [
      '1. Insert IC 7495 into Socket 1.',
      '2. Connect Pin 14 (VCC) to +5V and Pin 7 (GND) to GND.',
      '3. Connect 4-bit data: SW 2→Pin2(A), SW 3→Pin3(B), SW 4→Pin4(C), SW 5→Pin5(D).',
      '4. LOAD: Set Mode (Pin6) = HIGH (SW 1 → Pin6). Apply CLK2 pulse.',
      '   This loads SW 2–5 data into the register. LEDs 0–3 show loaded data.',
      '5. SHIFT OUT: Set Mode (Pin6) = LOW (SW 1 = 0). Apply CLK1 pulses.',
      '   Function Generator Settings: Frequency = 1 Hz, Amplitude = 5V p-p, DC Offset = 2V, Waveform = Square.',
      '   Each CLK1 pulse shifts data right; QD (Pin10 → LED3) gives bits serially.',
      '6. Read serial output from LED 3 (QD) on each clock pulse.'
    ],
    requiredICs: ['7495'],
    defaultSockets: [{ socketId: 0, partNumber: '7495' }],
    functionGenerator: {
      frequency: '1 Hz',
      amplitude: '5V p-p',
      dcOffset: '2V',
      waveform: 'Square',
      positive: 'IC_0_P8 (CLK2) / IC_0_P9 (CLK1)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK (Fn.Gen / SW 0)', switchIndex: 0 },
      { id: 1, label: 'MODE (SW 1)',  switchIndex: 1 },
      { id: 2, label: 'A (SW 2)',     switchIndex: 2 },
      { id: 3, label: 'B (SW 3)',     switchIndex: 3 },
      { id: 4, label: 'C (SW 4)',     switchIndex: 4 },
      { id: 5, label: 'D (SW 5)',     switchIndex: 5 }
    ],
    outputs: [
      { id: 0, label: 'QA (LED 0)', ledIndex: 0 },
      { id: 1, label: 'QB (LED 1)', ledIndex: 1 },
      { id: 2, label: 'QC (LED 2)', ledIndex: 2 },
      { id: 3, label: 'QD / Serial Out (LED 3)', ledIndex: 3 }
    ],
    truthTable: {
      headers: ['Mode', 'A', 'B', 'C', 'D', 'QA', 'QB', 'QC', 'QD'],
      rows: [
        { inputs: [1, 1, 1, 0, 1, 1], outputs: [1, 0, 1, 1] },  // Load phase
        { inputs: [1, 0, 0, 0, 0, 0], outputs: [0, 1, 0, 1] },  // Shift 1 (QD=1)
        { inputs: [1, 0, 0, 0, 0, 0], outputs: [0, 0, 1, 0] },  // Shift 2 (QD=0)
        { inputs: [1, 0, 0, 0, 0, 0], outputs: [0, 0, 0, 1] },  // Shift 3 (QD=1)
        { inputs: [1, 0, 0, 0, 0, 0], outputs: [0, 0, 0, 0] }   // Shift 4
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // MODE = SW 1
      { from: 'SW_1', to: 'IC_0_P6',  color: '#fbc02d' },
      // CLK → CLK2 for parallel load, CLK1 for shift
      { from: 'FG_POS', to: 'IC_0_P8',  color: '#ff7043' },  // CLK2 (load)
      { from: 'FG_POS', to: 'IC_0_P9',  color: '#ff7043' },  // CLK1 (shift)
      { from: 'FG_NEG', to: 'GND_1',    color: '#1e88e5' },
      // Parallel inputs
      { from: 'SW_2', to: 'IC_0_P2',  color: '#43a047' },
      { from: 'SW_3', to: 'IC_0_P3',  color: '#00acc1' },
      { from: 'SW_4', to: 'IC_0_P4',  color: '#ab47bc' },
      { from: 'SW_5', to: 'IC_0_P5',  color: '#fb8c00' },
      // Outputs
      { from: 'IC_0_P13', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P12', to: 'LED_1', color: '#29b6f6' },
      { from: 'IC_0_P11', to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P10', to: 'LED_3', color: '#ffa726' }
    ]
  },

  {
    id: 'exp11_pipo',
    expNum: 11,
    subMode: 'PIPO',
    title: 'Exp 11: Shift Register — PIPO (Parallel In, Parallel Out) using IC 7495',
    aim: 'To study the Parallel-In Parallel-Out (PIPO) mode of IC 7495.',
    apparatus: [
      { name: 'IC 7495', spec: '4-Bit Right/Left Universal Shift Register', qty: 1 },
      { name: 'Digital IC Trainer Kit', qty: 1 },
      { name: 'Function Generator Probe', qty: 1 },
      { name: 'Connecting Patch Cords', qty: 'As required' }
    ],
    theory: 'PIPO (Parallel In Parallel Out) Mode:\n• Set Mode (Pin 6) = 1 (HIGH).\n• Apply a single CLK2 (Pin 8) pulse.\n• All 4 bits at inputs A,B,C,D (Pins 2,3,4,5) are loaded simultaneously into the register.\n• All 4 output bits QA,QB,QC,QD (Pins 13,12,11,10) are available simultaneously at the outputs.\n• This is the fastest transfer method — 4 bits transferred in a single clock cycle.',
    procedure: [
      '1. Insert IC 7495 into Socket 1.',
      '2. Connect Pin 14 (VCC) to +5V and Pin 7 (GND) to GND.',
      '3. Set Mode (Pin 6) = HIGH by connecting Pin 6 to +5V (Mode = 1).',
      '4. Connect SW 1→Pin2(A), SW 2→Pin3(B), SW 3→Pin4(C), SW 4→Pin5(D) for parallel inputs.',
      '5. CLOCK (CLK2): Connect Function Generator (+) to Pin 8 (CLK2) and Function Generator (−) to GND.',
      '   Function Generator Settings: Frequency = 1 Hz, Amplitude = 5V p-p, DC Offset = 2V, Waveform = Square.',
      '   In the simulator: Connect FG_POS to Pin 8 (CLK2) and FG_NEG to GND.',
      '6. Connect QA (Pin 13) → LED 0, QB (Pin 12) → LED 1, QC (Pin 11) → LED 2, QD (Pin 10) → LED 3.',
      '7. Set desired 4-bit input using SW 1–4, then apply one clock pulse.',
      '8. Observe that LEDs 0–3 immediately reflect the applied 4-bit input data.'
    ],
    requiredICs: ['7495'],
    defaultSockets: [{ socketId: 0, partNumber: '7495' }],
    functionGenerator: {
      pin: 8,
      socketId: 0,
      frequency: '1 Hz',
      amplitude: '5V p-p',
      dcOffset: '2V',
      waveform: 'Square',
      positive: 'IC_0_P8 (CLK2)',
      negative: 'GND'
    },
    inputs: [
      { id: 0, label: 'CLK2 (Fn.Gen / SW 0)', switchIndex: 0 },
      { id: 1, label: 'A (SW 1)',              switchIndex: 1 },
      { id: 2, label: 'B (SW 2)',              switchIndex: 2 },
      { id: 3, label: 'C (SW 3)',              switchIndex: 3 },
      { id: 4, label: 'D (SW 4)',              switchIndex: 4 }
    ],
    outputs: [
      { id: 0, label: 'QA (LED 0)', ledIndex: 0 },
      { id: 1, label: 'QB (LED 1)', ledIndex: 1 },
      { id: 2, label: 'QC (LED 2)', ledIndex: 2 },
      { id: 3, label: 'QD (LED 3)', ledIndex: 3 }
    ],
    truthTable: {
      headers: ['A', 'B', 'C', 'D', 'QA', 'QB', 'QC', 'QD'],
      rows: [
        { inputs: [1, 1, 0, 1, 1], outputs: [1, 0, 1, 1] },
        { inputs: [1, 0, 1, 0, 0], outputs: [0, 1, 0, 0] },
        { inputs: [1, 1, 1, 1, 0], outputs: [1, 1, 1, 0] },
        { inputs: [1, 0, 0, 0, 1], outputs: [0, 0, 0, 1] }
      ]
    },
    referenceWiring: [
      { from: 'VCC', to: 'IC_0_P14', color: '#e53935' },
      { from: 'GND', to: 'IC_0_P7',  color: '#1e88e5' },
      // MODE = 1 (VCC for parallel load)
      { from: 'VCC_1', to: 'IC_0_P6',  color: '#e53935' },
      // CLK2 = FG_POS -> Pin 8
      { from: 'FG_POS', to: 'IC_0_P8',  color: '#ff7043' },
      { from: 'FG_NEG', to: 'GND_1',    color: '#1e88e5' },
      // Parallel inputs
      { from: 'SW_1', to: 'IC_0_P2',  color: '#43a047' },
      { from: 'SW_2', to: 'IC_0_P3',  color: '#00acc1' },
      { from: 'SW_3', to: 'IC_0_P4',  color: '#ab47bc' },
      { from: 'SW_4', to: 'IC_0_P5',  color: '#fb8c00' },
      // Outputs
      { from: 'IC_0_P13', to: 'LED_0', color: '#4caf50' },
      { from: 'IC_0_P12', to: 'LED_1', color: '#29b6f6' },
      { from: 'IC_0_P11', to: 'LED_2', color: '#ab47bc' },
      { from: 'IC_0_P10', to: 'LED_3', color: '#ffa726' }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXPERIMENTS };
}
