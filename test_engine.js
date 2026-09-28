const { IC_DEFINITIONS } = require('./js/ics/ic_definitions.js');
const { NetlistEngine } = require('./js/engine/netlist.js');
const { EXPERIMENTS } = require('./js/experiments/experiments.js');
const { LabVerifier } = require('./js/engine/verifier.js');

console.log('--- Testing Virtual DE Trainer Engine ---');
console.log(`Loaded ${Object.keys(IC_DEFINITIONS).length} IC definitions.`);
console.log(`Loaded ${EXPERIMENTS.length} experiments and sub-modes.`);

let allPassed = true;

// Part 1: Verify all reference circuits across all 17 experiments
console.log('\n--- Part 1: Reference Circuits Verification ---');
for (const exp of EXPERIMENTS) {
  const engine = new NetlistEngine();
  const verifier = new LabVerifier(engine);

  // Setup sockets
  for (const s of exp.defaultSockets) {
    engine.installIC(s.socketId, s.partNumber);
  }

  // Load reference wiring
  for (const w of exp.referenceWiring) {
    engine.addWire(w.from, w.to, w.color);
  }

  const report = verifier.verify(exp);
  if (report.passed) {
    console.log(`[PASS] ${exp.title}: All ${report.rowResults.length} test vectors passed.`);
  } else {
    allPassed = false;
    console.error(`[FAIL] ${exp.title}: Verification failed!`);
    console.error('Remarks:', report.instructorRemarks);
    console.error('Structural checks:', report.structuralChecks);
    const failedRows = report.rowResults.filter(r => !r.passed);
    console.error('Failed rows sample:', JSON.stringify(failedRows.slice(0, 2)));
  }
}

// Part 2: Verify Flexible Role-Based System (Tests 1 through 10 + edge cases)
console.log('\n--- Part 2: Flexible Role-Based Circuit Verification ---');
require('./test_role_based_verifier.js');

if (allPassed) {
  console.log('\n>>> SUCCESS: ALL EXPERIMENTS AND ROLE-BASED VERIFICATION TESTS VERIFIED 100%! <<<');
  process.exit(0);
} else {
  console.error('\n>>> SOME EXPERIMENTS FAILED VERIFICATION <<<');
  process.exit(1);
}
