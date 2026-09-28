const { NetlistEngine } = require('./js/engine/netlist.js');
const { EXPERIMENTS } = require('./js/experiments/experiments.js');
const { TopologyVerifier } = require('./js/engine/topology_verifier.js');
const { LabVerifier } = require('./js/engine/verifier.js');

console.log('====================================================');
console.log('   Testing Flexible Role-Based Verification System  ');
console.log('====================================================\n');

const andExp = EXPERIMENTS.find(e => e.id === 'exp1_and');
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, extraInfo = '') {
  if (condition) {
    console.log(`[PASS] ${testName} ${extraInfo ? '(' + extraInfo + ')' : ''}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${testName} ${extraInfo ? '-> ' + extraInfo : ''}`);
    testsFailed++;
  }
}

/**
 * Requirement 5.9: Student-facing error messages must NEVER contain:
 * - "IC_" followed by a digit
 * - "SW_" followed by a digit
 * - "LED_" followed by a digit
 * - "Expected"
 */
function assertStudentSafe(rep, context) {
  const forbiddenRegex = /(?:IC_\d|SW_\d|LED_\d|Expected)/;
  const texts = [];
  if (rep.errors) texts.push(...rep.errors);
  if (rep.instructorRemarks) texts.push(...rep.instructorRemarks);
  if (rep.structuralChecks) {
    for (const c of rep.structuralChecks) {
      if (c.status === 'FAILED') texts.push(c.detail);
    }
  }

  for (const t of texts) {
    if (forbiddenRegex.test(t)) {
      throw new Error(`[LEAK DETECTED] Forbidden internal string found in student-facing message during "${context}": "${t}"`);
    }
  }
}

// ----------------------------------------------------
// Test 1: AND gate correct on 7408 in socket 1 or 2 (Fix 1)
// ----------------------------------------------------
{
  const engine1 = new NetlistEngine();
  engine1.installIC(1, '7408'); // Socket 1
  engine1.addWire('VCC', 'IC_1_P14');
  engine1.addWire('GND', 'IC_1_P7');
  engine1.addWire('SW_4', 'IC_1_P1');
  engine1.addWire('SW_7', 'IC_1_P2');
  engine1.addWire('IC_1_P3', 'LED_5');

  const verifier1 = new LabVerifier(engine1);
  const rep1 = verifier1.verify(andExp);
  assert(rep1.passed === true, 'Test 1a: AND gate on 7408 in socket 1', JSON.stringify(rep1.mapping.inputs));

  const engine2 = new NetlistEngine();
  engine2.installIC(2, '7408'); // Socket 2
  engine2.addWire('VCC', 'IC_2_P14');
  engine2.addWire('GND', 'IC_2_P7');
  engine2.addWire('SW_2', 'IC_2_P1');
  engine2.addWire('SW_6', 'IC_2_P2');
  engine2.addWire('IC_2_P3', 'LED_7');

  const verifier2 = new LabVerifier(engine2);
  const rep2 = verifier2.verify(andExp);
  assert(rep2.passed === true, 'Test 1b: AND gate on 7408 in socket 2', JSON.stringify(rep2.mapping.inputs));
}

// ----------------------------------------------------
// Test 2: AND gate on gate slot 2 (pins 4, 5, 6) (Fix 2)
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_3', 'IC_0_P4');
  engine.addWire('SW_5', 'IC_0_P5');
  engine.addWire('IC_0_P6', 'LED_2');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true, 'Test 2: AND gate on gate slot 2 (pins 4, 5, 6)', JSON.stringify(rep.mapping.inputs));
}

// ----------------------------------------------------
// Test 3: AND gate on gate slot 3 (pins 9, 10, 8) (Fix 2)
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_1', 'IC_0_P9');
  engine.addWire('SW_6', 'IC_0_P10');
  engine.addWire('IC_0_P8', 'LED_4');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true, 'Test 3: AND gate on gate slot 3 (pins 9, 10, 8)', JSON.stringify(rep.mapping.inputs));
}

// ----------------------------------------------------
// Test 4: AND experiment wired with 7400 NAND circuit (Fix 5.4)
// Topologically similar but functionally different -> FAIL at truth-table stage with 4-row mismatches
// ----------------------------------------------------
{
  const andExpWith7400 = {
    ...andExp,
    requiredICs: ['7400'],
    defaultSockets: [{ socketId: 0, partNumber: '7400' }]
  };
  const engine = new NetlistEngine();
  engine.installIC(0, '7400');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_0', 'IC_0_P1');
  engine.addWire('SW_1', 'IC_0_P2');
  engine.addWire('IC_0_P3', 'LED_0');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExpWith7400);
  const structuralPassed = rep.structuralChecks.every(c => c.status === 'PASSED');
  const fourRowsMismatched = rep.rowResults.length === 4 && rep.rowResults.every(r => !r.passed);

  assert(
    rep.passed === false && structuralPassed && fourRowsMismatched,
    'Test 4: AND with 7400 NAND circuit fails at truth-table with 4-row mismatches',
    `Failed rows: ${rep.rowResults.filter(r => !r.passed).length}/4`
  );
  assertStudentSafe(rep, 'Test 4');
}

// ----------------------------------------------------
// Test 5: Direct SW->LED bypass alone -> FAIL with bypass message (Fix 5.5)
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'LED_5'); // Direct bypass

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  const hasBypassMsg = rep.structuralChecks.some(c => c.detail && c.detail.includes('Direct switch-to-LED bypass detected'));

  assert(
    rep.passed === false && hasBypassMsg,
    'Test 5: Direct SW->LED bypass alone fails with explicit bypass message'
  );
  assertStudentSafe(rep, 'Test 5');
}

// ----------------------------------------------------
// Test 6: Non-commutative experiment with swapped inputs -> FAIL (Fix 5.6)
// Half-Subtractor: inverts B and ANDs with A -> function is changed -> FAIL
// ----------------------------------------------------
{
  const hsExp = EXPERIMENTS.find(e => e.id === 'exp3_half_subtractor');
  const engine = new NetlistEngine();
  engine.installIC(0, '7486');
  engine.installIC(1, '7404');
  engine.installIC(2, '7408');
  engine.addWire('VCC', 'IC_0_P14'); engine.addWire('GND', 'IC_0_P7');
  engine.addWire('VCC', 'IC_1_P14'); engine.addWire('GND', 'IC_1_P7');
  engine.addWire('VCC', 'IC_2_P14'); engine.addWire('GND', 'IC_2_P7');

  // XOR: Diff = SW0 ^ SW1
  engine.addWire('SW_0', 'IC_0_P1');
  engine.addWire('SW_1', 'IC_0_P2');
  engine.addWire('IC_0_P3', 'LED_0'); // Difference

  // Student inverts SW1 instead of SW0 (swapped non-commutative role):
  engine.addWire('SW_1', 'IC_1_P1');
  engine.addWire('IC_1_P2', 'IC_2_P1');
  engine.addWire('SW_0', 'IC_2_P2');
  engine.addWire('IC_2_P3', 'LED_1'); // Borrow

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(hsExp);
  assert(rep.passed === false, 'Test 6: Non-commutative Half-Subtractor with swapped inputs fails');
  assertStudentSafe(rep, 'Test 6');
}

// ----------------------------------------------------
// Test 7: Commutative experiment with swapped inputs -> PASS (Fix 5.7)
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'IC_0_P2'); // Swapped to pin 2
  engine.addWire('SW_7', 'IC_0_P1'); // Swapped to pin 1
  engine.addWire('IC_0_P3', 'LED_5');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true, 'Test 7: Commutative AND gate with swapped inputs passes', JSON.stringify(rep.mapping.inputs));
}

// ----------------------------------------------------
// Test 8: Multi-IC Full Adder in different sockets and switches/LEDs -> PASS (Fix 5.8)
// ----------------------------------------------------
{
  const faExp = EXPERIMENTS.find(e => e.id === 'exp3_full_adder');
  // Installed: 7486 in socket 2, 7408 in socket 0, 7432 in socket 1
  const engine = new NetlistEngine();
  engine.installIC(2, '7486');
  engine.installIC(0, '7408');
  engine.installIC(1, '7432');
  engine.addWire('VCC', 'IC_2_P14'); engine.addWire('GND', 'IC_2_P7');
  engine.addWire('VCC', 'IC_0_P14'); engine.addWire('GND', 'IC_0_P7');
  engine.addWire('VCC', 'IC_1_P14'); engine.addWire('GND', 'IC_1_P7');

  // SW_3 = A, SW_5 = B, SW_6 = Cin
  // XOR 1 on 7486 (socket 2): A ^ B
  engine.addWire('SW_3', 'IC_2_P1');
  engine.addWire('SW_5', 'IC_2_P2');
  // XOR 2 on 7486 (socket 2): (A ^ B) ^ Cin -> Sum -> LED_4
  engine.addWire('IC_2_P3', 'IC_2_P4');
  engine.addWire('SW_6', 'IC_2_P5');
  engine.addWire('IC_2_P6', 'LED_4');

  // AND 1 on 7408 (socket 0): A . B
  engine.addWire('SW_3', 'IC_0_P1');
  engine.addWire('SW_5', 'IC_0_P2');
  // AND 2 on 7408 (socket 0): (A ^ B) . Cin
  engine.addWire('IC_2_P3', 'IC_0_P4');
  engine.addWire('SW_6', 'IC_0_P5');

  // OR on 7432 (socket 1): Cout -> LED_7
  engine.addWire('IC_0_P3', 'IC_1_P1');
  engine.addWire('IC_0_P6', 'IC_1_P2');
  engine.addWire('IC_1_P3', 'LED_7');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(faExp);
  assert(
    rep.passed === true,
    'Test 8: Multi-IC Full Adder in sockets (2, 0, 1) with SW3,5,6 and LED4,7 passes',
    `Sum=${rep.mapping.outputs['Sum']}, Cout=${rep.mapping.outputs['Cout']}`
  );
}

// ----------------------------------------------------
// Test 9: Wrong IC pin -> FAIL with student-safe message (Fix 5.9)
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'IC_0_P1');
  engine.addWire('SW_7', 'IC_0_P4'); // Wrong pin!
  engine.addWire('IC_0_P3', 'LED_5');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === false, 'Test 9: Wrong IC pin correctly fails');
  assertStudentSafe(rep, 'Test 9');
}

// ----------------------------------------------------
// Test 10: Extra bridge (switches shorted) -> FAIL with student-safe message
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'IC_0_P1');
  engine.addWire('SW_7', 'IC_0_P2');
  engine.addWire('SW_4', 'SW_7'); // Unintended bridge!
  engine.addWire('IC_0_P3', 'LED_5');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === false, 'Test 10: Extra bridge between switches correctly fails');
  assertStudentSafe(rep, 'Test 10');
}

// ----------------------------------------------------
// Test 11: Distinct outputs shorted together -> FAIL with student-safe message
// ----------------------------------------------------
{
  const haExp = EXPERIMENTS.find(e => e.id === 'exp3_half_adder');
  const engine = new NetlistEngine();
  engine.installIC(0, '7486');
  engine.installIC(1, '7408');
  engine.addWire('VCC', 'IC_0_P14'); engine.addWire('GND', 'IC_0_P7');
  engine.addWire('VCC', 'IC_1_P14'); engine.addWire('GND', 'IC_1_P7');
  engine.addWire('SW_0', 'IC_0_P1'); engine.addWire('SW_0', 'IC_1_P1');
  engine.addWire('SW_1', 'IC_0_P2'); engine.addWire('SW_1', 'IC_1_P2');
  engine.addWire('IC_0_P3', 'LED_0'); // Sum
  engine.addWire('IC_1_P3', 'LED_0'); // Carry shorted to same LED!

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(haExp);
  assert(rep.passed === false, 'Test 11: Distinct outputs shorted together correctly fails');
  assertStudentSafe(rep, 'Test 11');
}

// ----------------------------------------------------
// Test 12: Property-Style Sweep Across ALL 17 Experiments (Fix 5.10)
// Tests: Identity, Reversed, Rotated mappings -> PASS
// Dropping each single reference wire -> FAIL + student-safe error message
// ----------------------------------------------------
console.log('\n--- Running Comprehensive Property-Style Sweep Across All 17 Experiments ---');
let sweepPassedCount = 0;
let sweepDropTestCount = 0;

for (const exp of EXPERIMENTS) {
  function buildCircuit(swMap, ledMap, dropWireIndex = -1) {
    const engine = new NetlistEngine();
    const defaultSockets = exp.defaultSockets || [];
    for (const ds of defaultSockets) {
      engine.installIC(ds.socketId, ds.partNumber);
    }

    const refWires = exp.referenceWiring || [];
    for (let w = 0; w < refWires.length; w++) {
      if (w === dropWireIndex) continue;
      const wire = refWires[w];
      let fromNode = wire.from;
      let toNode = wire.to;

      if (fromNode.startsWith('SW_')) {
        const swIdx = parseInt(fromNode.replace('SW_', ''), 10);
        fromNode = `SW_${swMap(swIdx)}`;
      } else if (fromNode.startsWith('LED_')) {
        const ledIdx = parseInt(fromNode.replace('LED_', ''), 10);
        fromNode = `LED_${ledMap(ledIdx)}`;
      }

      if (toNode.startsWith('SW_')) {
        const swIdx = parseInt(toNode.replace('SW_', ''), 10);
        toNode = `SW_${swMap(swIdx)}`;
      } else if (toNode.startsWith('LED_')) {
        const ledIdx = parseInt(toNode.replace('LED_', ''), 10);
        toNode = `LED_${ledMap(ledIdx)}`;
      }

      engine.addWire(fromNode, toNode);
    }

    return engine;
  }

  // 1. Identity permutation
  {
    const engine = buildCircuit(i => i, j => j);
    const rep = new LabVerifier(engine).verify(exp);
    if (!rep.passed) {
      console.error(`[FAIL SWEEP] ${exp.title}: Identity permutation failed!`);
    } else {
      sweepPassedCount++;
    }
  }

  // 2. Reversed permutation
  {
    const engine = buildCircuit(i => 7 - i, j => 7 - j);
    const rep = new LabVerifier(engine).verify(exp);
    if (!rep.passed) {
      console.error(`[FAIL SWEEP] ${exp.title}: Reversed permutation failed!`);
    } else {
      sweepPassedCount++;
    }
  }

  // 3. Rotated permutation
  {
    const engine = buildCircuit(i => (i + 3) % 8, j => (j + 4) % 8);
    const rep = new LabVerifier(engine).verify(exp);
    if (!rep.passed) {
      console.error(`[FAIL SWEEP] ${exp.title}: Rotated permutation failed!`);
    } else {
      sweepPassedCount++;
    }
  }

  // 4. Single-wire-drop verification
  const refWires = exp.referenceWiring || [];
  for (let w = 0; w < refWires.length; w++) {
    const engine = buildCircuit(i => i, j => j, w);
    const rep = new LabVerifier(engine).verify(exp);
    if (rep.passed) {
      console.error(`[FAIL SWEEP] ${exp.title}: Dropping wire ${w} (${refWires[w].from} -> ${refWires[w].to}) falsely passed!`);
    } else {
      assertStudentSafe(rep, `${exp.id} dropped wire ${w}`);
      sweepDropTestCount++;
    }
  }
}

const totalExpectedSweepPasses = EXPERIMENTS.length * 3;
assert(
  sweepPassedCount === totalExpectedSweepPasses,
  `Test 12a: All 17 experiments passed identity, reversed, and rotated permutations (${sweepPassedCount}/${totalExpectedSweepPasses})`
);
assert(
  sweepDropTestCount > 0,
  `Test 12b: All ${sweepDropTestCount} single-wire drop tests correctly failed and produced student-safe messages`
);

console.log('\n----------------------------------------------------');
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed.`);
if (testsFailed === 0) {
  console.log('>>> ALL ROLE-BASED VERIFICATION TESTS PASSED! <<<');
} else {
  process.exit(1);
}
