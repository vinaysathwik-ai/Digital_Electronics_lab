/**
 * Lab Instructor Verification Engine
 * Validates circuit topology, power rules, floating inputs,
 * executes complete truth-table test vectors, and generates official lab report.
 */

let TOPOLOGY_VERIFIER = typeof TopologyVerifier !== 'undefined' ? TopologyVerifier : null;
if (!TOPOLOGY_VERIFIER && typeof require !== 'undefined') {
  try {
    TOPOLOGY_VERIFIER = require('./topology_verifier.js').TopologyVerifier;
  } catch (e) {}
}

class LabVerifier {
  constructor(engine) {
    this.engine = engine;
  }

  /**
   * Run verification on the currently selected experiment
   * @param {Object} experiment - Experiment definition from EXPERIMENTS
   * @param {Object} [options={}] - Verification options (e.g. { debug: boolean })
   */
  verify(experiment, options = {}) {
    const report = {
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      timestamp: new Date().toLocaleString(),
      passed: false,
      structuralChecks: [],
      rowResults: [],
      instructorRemarks: [],
      warnings: [],
      mapping: null
    };

    // 1. Initial simulation with current state to check shorts and power
    const initialSim = this.engine.simulate();

    // Check CRITICAL short circuits
    if (initialSim.errors.length > 0) {
      report.instructorRemarks.push(...initialSim.errors);
      report.structuralChecks.push({
        title: 'Electrical Safety & Short-Circuit Check',
        status: 'FAILED',
        detail: initialSim.errors.join('; ')
      });
      return report;
    } else {
      report.structuralChecks.push({
        title: 'Electrical Safety & Short-Circuit Check',
        status: 'PASSED',
        detail: 'No shorts or bus contentions detected.'
      });
    }

    // 2. Check if Required ICs are installed
    const installedICs = this.engine.sockets
      .filter(s => s.ic !== null)
      .map(s => s.ic.partNumber);

    const missingICs = [];
    for (const req of (experiment.requiredICs || [])) {
      if (!installedICs.includes(req)) {
        missingICs.push(req);
      }
    }

    if (missingICs.length > 0) {
      report.structuralChecks.push({
        title: 'Required IC Verification',
        status: 'FAILED',
        detail: `Missing required IC(s): ${missingICs.join(', ')}. Please insert from the component tray.`
      });
      report.instructorRemarks.push(`Incomplete setup: Required IC(s) ${missingICs.join(', ')} must be installed on the trainer kit.`);
      return report;
    } else {
      report.structuralChecks.push({
        title: 'Required IC Verification',
        status: 'PASSED',
        detail: `All required ICs (${experiment.requiredICs.join(', ')}) installed on board.`
      });
    }

    // 3. Check Power (Vcc and GND) on all active sockets
    const powerFailures = [];
    for (let s = 0; s < this.engine.sockets.length; s++) {
      const sock = this.engine.sockets[s];
      if (!sock.ic) continue;
      const status = initialSim.icStatus[s];
      if (!status || !status.powered) {
        powerFailures.push(`The required power connection (VCC/GND) for the ${sock.ic.partNumber} is missing or disconnected.`);
      }
    }

    if (powerFailures.length > 0) {
      report.structuralChecks.push({
        title: 'IC Power Enforcement (Do\'s & Don\'ts Rule 5)',
        status: 'FAILED',
        detail: powerFailures.join(' | ')
      });
      report.instructorRemarks.push('Safety rule violation: Power supply (VCC +5V and GND) must be wired before operating ICs.');
      return report;
    } else {
      report.structuralChecks.push({
        title: 'IC Power Enforcement (Do\'s & Don\'ts Rule 5)',
        status: 'PASSED',
        detail: 'All installed ICs properly energized with +5V and GND.'
      });
    }

    // 4. Circuit Topology & Dynamic Component Discovery
    const VerifierClass = TOPOLOGY_VERIFIER || (typeof TopologyVerifier !== 'undefined' ? TopologyVerifier : null);
    if (!VerifierClass) {
      throw new Error('TopologyVerifier is not available.');
    }
    const topologyVerifier = new VerifierClass();
    const topologyResult = topologyVerifier.verify(experiment, this.engine, options);

    if (options.debug && topologyResult.debug) {
      report.debug = topologyResult.debug;
    }

    if (!topologyResult.passed) {
      report.structuralChecks.push({
        title: 'Circuit Topology & Component Discovery',
        status: 'FAILED',
        detail: topologyResult.errors.join('; ')
      });
      report.instructorRemarks.push(
        '✗ Circuit Topology Check Failed:',
        ...topologyResult.errors,
        'Functional verification was not executed because the circuit topology is invalid.'
      );
      return report;
    } else {
      report.structuralChecks.push({
        title: 'Circuit Topology & Component Discovery',
        status: 'PASSED',
        detail: topologyResult.detail
      });
    }

    // 5. Truth Table Verification across all test vectors using discovered physical components
    const savedSwitches = [...this.engine.switches];
    let allRowsPassed = false;
    let bestRowResults = [];
    let matchedMapping = null;

    const candidateMappings = (topologyResult.candidateMappings && topologyResult.candidateMappings.length > 0)
      ? topologyResult.candidateMappings
      : [topologyResult.mapping];

    try {
      const rows = experiment.truthTable.rows;

      for (const mapping of candidateMappings) {
        let currentMappingPassed = true;
        const currentRowResults = [];

        for (let r = 0; r < rows.length; r++) {
          const row = rows[r];

          // Apply inputs to discovered physical switches
          for (let inIdx = 0; inIdx < experiment.inputs.length; inIdx++) {
            const swIdx = mapping.inputSwitches[inIdx];
            const val = row.inputs[inIdx];
            this.engine.switches[swIdx] = val;
          }

          // Run simulation
          const sim = this.engine.simulate();

          // Read actual outputs from discovered physical LEDs
          const actualOutputs = [];
          let rowMatch = true;

          for (let outIdx = 0; outIdx < experiment.outputs.length; outIdx++) {
            const ledIdx = mapping.outputLeds[outIdx];
            const actualVal = sim.ledOutputs[ledIdx];
            const expectedVal = row.outputs[outIdx];

            actualOutputs.push(actualVal);
            if (actualVal !== expectedVal) {
              rowMatch = false;
            }
          }

          if (!rowMatch) {
            currentMappingPassed = false;
          }

          currentRowResults.push({
            rowIdx: r,
            inputs: [...row.inputs],
            expectedOutputs: [...row.outputs],
            actualOutputs,
            passed: rowMatch
          });
        }

        bestRowResults = currentRowResults;
        if (currentMappingPassed) {
          allRowsPassed = true;
          matchedMapping = mapping;
          break; // Successfully matched candidate mapping!
        }
      }
    } finally {
      // Restore original switch state
      this.engine.switches = savedSwitches;
      this.engine.simulate();
    }

    report.mapping = matchedMapping || topologyResult.mapping;
    report.rowResults = bestRowResults;

    // Include floating input warnings if any
    if (initialSim.warnings.length > 0) {
      report.warnings.push(...initialSim.warnings);
    }

    // 6. Final Evaluation
    if (allRowsPassed) {
      report.passed = true;
      report.instructorRemarks.push(
        '✓ VERIFIED & APPROVED BY LAB INSTRUCTOR',
        'Circuit topology and functional truth table verified successfully with student-selected components.'
      );
    } else {
      report.passed = false;
      const failedCount = report.rowResults.filter(r => !r.passed).length;
      report.instructorRemarks.push(
        `✗ Verification Failed: ${failedCount} truth-table row(s) mismatched actual LED output.`,
        'Check logic connections and switch/LED states.'
      );
    }

    return report;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LabVerifier };
}
