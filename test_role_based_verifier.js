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

// ----------------------------------------------------
// Test 1: Correct reference physical mapping
// SW0 -> P1, SW1 -> P2, P3 -> LED0
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_0', 'IC_0_P1');
  engine.addWire('SW_1', 'IC_0_P2');
  engine.addWire('IC_0_P3', 'LED_0');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true, 'Test 1: Correct reference physical mapping (SW0, SW1, LED0)', rep.mapping ? JSON.stringify(rep.mapping.inputs) : '');
}

// ----------------------------------------------------
// Test 2: Different valid physical mapping
// SW4 -> P1, SW7 -> P2, P3 -> LED5
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'IC_0_P1');
  engine.addWire('SW_7', 'IC_0_P2');
  engine.addWire('IC_0_P3', 'LED_5');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true && rep.mapping.outputLeds[0] === 5, 'Test 2: Different valid physical mapping (SW4, SW7, LED5)', `Detected inputs: ${JSON.stringify(rep.mapping.inputs)}, LED: ${JSON.stringify(rep.mapping.outputs)}`);
}

// ----------------------------------------------------
// Test 3: Another valid mapping
// SW2 -> P1, SW6 -> P2, P3 -> LED7
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_2', 'IC_0_P1');
  engine.addWire('SW_6', 'IC_0_P2');
  engine.addWire('IC_0_P3', 'LED_7');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true && rep.mapping.outputLeds[0] === 7, 'Test 3: Another valid mapping (SW2, SW6, LED7)', `Detected inputs: ${JSON.stringify(rep.mapping.inputs)}, LED: ${JSON.stringify(rep.mapping.outputs)}`);
}

// ----------------------------------------------------
// Test 4: Wrong IC pin
// SW4 -> P1, SW7 -> P4, P3 -> LED5
// Expected: FAIL
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
  assert(rep.passed === false, 'Test 4: Wrong IC pin (SW7 -> P4)', `Correctly rejected: ${rep.structuralChecks.find(c => c.status === 'FAILED')?.detail}`);
}

// ----------------------------------------------------
// Test 5: Bypass
// SW4 -> LED5 (IC bypassed)
// Expected: FAIL
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'LED_5'); // Direct bypass!

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === false, 'Test 5: Bypass (SW4 -> LED5)', `Correctly rejected: ${rep.structuralChecks.find(c => c.status === 'FAILED')?.detail}`);
}

// ----------------------------------------------------
// Test 6: Extra bridge
// SW4 -> P1, SW7 -> P2, SW4 -> SW7, P3 -> LED5
// Expected: FAIL
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'IC_0_P1');
  engine.addWire('SW_7', 'IC_0_P2');
  engine.addWire('SW_4', 'SW_7'); // Forbidden bridge!
  engine.addWire('IC_0_P3', 'LED_5');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === false, 'Test 6: Extra bridge (SW4 shorted to SW7)', `Correctly rejected: ${rep.structuralChecks.find(c => c.status === 'FAILED')?.detail}`);
}

// ----------------------------------------------------
// Test 7: No output LED
// SW4 -> P1, SW7 -> P2
// Expected: FAIL
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_4', 'IC_0_P1');
  engine.addWire('SW_7', 'IC_0_P2');
  // No LED!

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === false, 'Test 7: No output LED', `Correctly rejected: ${rep.structuralChecks.find(c => c.status === 'FAILED')?.detail}`);
}

// ----------------------------------------------------
// Test 8: Wrong gate (7400 NAND instead of 7408 AND)
// Expected: FAIL
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7400'); // Wrong IC!
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('SW_0', 'IC_0_P1');
  engine.addWire('SW_1', 'IC_0_P2');
  engine.addWire('IC_0_P3', 'LED_0');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === false, 'Test 8: Wrong gate (7400 instead of 7408)', `Correctly rejected: ${rep.structuralChecks.find(c => c.status === 'FAILED')?.detail}`);
}

// ----------------------------------------------------
// Test 9: Correct topology but wrong functional behavior
// (e.g. Pin 3 connected to Pin 6 of an unpowered gate or shorted)
// Or truth table mismatch. Let's test OR gate tested against AND experiment!
// ----------------------------------------------------
{
  // If student installed 7408 AND 7432, but wired to OR gate pins on 7432
  const orExp = EXPERIMENTS.find(e => e.id === 'exp1_or');
  const engine = new NetlistEngine();
  engine.installIC(0, '7408'); // Has 7408, but we wire it as an AND gate and test against OR experiment!
  // Wait, orExp requires 7432, so let's install both 7432 and 7408:
  engine.installIC(0, '7432');
  engine.installIC(1, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('VCC', 'IC_1_P14');
  engine.addWire('GND', 'IC_1_P7');
  // Wire inputs to 7408 (AND) instead of 7432 (OR):
  engine.addWire('SW_0', 'IC_1_P1');
  engine.addWire('SW_1', 'IC_1_P2');
  engine.addWire('IC_1_P3', 'LED_0');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(orExp); // orExp expects IC 0 (7432)
  assert(rep.passed === false, 'Test 9: Correct topology on wrong IC -> Fails');
}

// ----------------------------------------------------
// Test 10: Different physical mapping + correct functional behavior (Half-Adder)
// 7486 (XOR) & 7408 (AND) using SW3, SW6 and LED2, LED7
// ----------------------------------------------------
{
  const haExp = EXPERIMENTS.find(e => e.id === 'exp3_half_adder');
  const engine = new NetlistEngine();
  engine.installIC(0, '7486');
  engine.installIC(1, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('VCC', 'IC_1_P14');
  engine.addWire('GND', 'IC_1_P7');

  // Student uses SW_3 for A, SW_6 for B:
  engine.addWire('SW_3', 'IC_0_P1');
  engine.addWire('SW_3', 'IC_1_P1');

  engine.addWire('SW_6', 'IC_0_P2');
  engine.addWire('SW_6', 'IC_1_P2');

  // Student uses LED_2 for Sum (IC_0_P3) and LED_7 for Carry (IC_1_P3):
  engine.addWire('IC_0_P3', 'LED_2');
  engine.addWire('IC_1_P3', 'LED_7');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(haExp);
  assert(rep.passed === true, 'Test 10: Half-Adder with SW3, SW6 and LED2, LED7', `Discovered: Sum=${rep.mapping.outputs['Sum S']}, Carry=${rep.mapping.outputs['Carry C']}`);
}

// ----------------------------------------------------
// Test 11: Commutative input swap on AND gate
// SW4 -> P2, SW7 -> P1, P3 -> LED5
// Expected: PASS
// ----------------------------------------------------
{
  const engine = new NetlistEngine();
  engine.installIC(0, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  // Swapped: SW4 to Pin 2, SW7 to Pin 1
  engine.addWire('SW_4', 'IC_0_P2');
  engine.addWire('SW_7', 'IC_0_P1');
  engine.addWire('IC_0_P3', 'LED_5');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(andExp);
  assert(rep.passed === true, 'Test 11: Commutative input swap on AND gate (SW4 -> P2, SW7 -> P1)', `Detected inputs: ${JSON.stringify(rep.mapping.inputs)}`);
}

// ----------------------------------------------------
// Test 12: Distinct outputs shorted together
// IC_0_P3 (Sum) and IC_1_P3 (Carry) shorted to same LED
// Expected: FAIL
// ----------------------------------------------------
{
  const haExp = EXPERIMENTS.find(e => e.id === 'exp3_half_adder');
  const engine = new NetlistEngine();
  engine.installIC(0, '7486');
  engine.installIC(1, '7408');
  engine.addWire('VCC', 'IC_0_P14');
  engine.addWire('GND', 'IC_0_P7');
  engine.addWire('VCC', 'IC_1_P14');
  engine.addWire('GND', 'IC_1_P7');

  engine.addWire('SW_0', 'IC_0_P1');
  engine.addWire('SW_0', 'IC_1_P1');
  engine.addWire('SW_1', 'IC_0_P2');
  engine.addWire('SW_1', 'IC_1_P2');

  // Both outputs wired to same LED_0!
  engine.addWire('IC_0_P3', 'LED_0');
  engine.addWire('IC_1_P3', 'LED_0');

  const verifier = new LabVerifier(engine);
  const rep = verifier.verify(haExp);
  assert(rep.passed === false, 'Test 12: Distinct outputs shorted together', `Correctly rejected: ${rep.structuralChecks.find(c => c.status === 'FAILED')?.detail}`);
}

console.log('\n----------------------------------------------------');
console.log(`Results: ${testsPassed} passed, ${testsFailed} failed.`);
if (testsFailed === 0) {
  console.log('>>> ALL ROLE-BASED VERIFICATION TESTS PASSED! <<<');
  process.exit(0);
} else {
  console.error('>>> SOME TESTS FAILED! <<<');
  process.exit(1);
}
