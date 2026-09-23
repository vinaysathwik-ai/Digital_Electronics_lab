/**
 * Lab Instructor Verification Engine
 * Validates circuit topology, power rules, floating inputs,
 * executes complete truth-table test vectors, and generates official lab report.
 */

class LabVerifier {
  constructor(engine) {
    this.engine = engine;
  }

  /**
   * Run verification on the currently selected experiment
   * @param {Object} experiment - Experiment definition from EXPERIMENTS
   */
  verify(experiment) {
    const report = {
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      timestamp: new Date().toLocaleString(),
      passed: false,
      structuralChecks: [],
      rowResults: [],
      instructorRemarks: [],
      warnings: []
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
    for (const req of experiment.requiredICs) {
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
      report.instructorRemarks.push(`Incomplete setup: Expected IC(s) ${missingICs.join(', ')} on trainer kit.`);
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
        powerFailures.push(`${sock.label} (${sock.ic.partNumber}): VCC or GND disconnected.`);
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

    // 4. Truth Table Verification across all test vectors
    // Save current switch state
    const savedSwitches = [...this.engine.switches];
    let allRowsPassed = true;

    try {
      const rows = experiment.truthTable.rows;
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];

        // Apply inputs to corresponding switches
        for (let inIdx = 0; inIdx < experiment.inputs.length; inIdx++) {
          const inpDef = experiment.inputs[inIdx];
          const val = row.inputs[inIdx];
          this.engine.switches[inpDef.switchIndex] = val;
        }

        // Run simulation
        const sim = this.engine.simulate();

        // Read actual outputs
        const actualOutputs = [];
        let rowMatch = true;

        for (let outIdx = 0; outIdx < experiment.outputs.length; outIdx++) {
          const outDef = experiment.outputs[outIdx];
          const actualVal = sim.ledOutputs[outDef.ledIndex];
          const expectedVal = row.outputs[outIdx];

          actualOutputs.push(actualVal);
          if (actualVal !== expectedVal) {
            rowMatch = false;
          }
        }

        if (!rowMatch) {
          allRowsPassed = false;
        }

        report.rowResults.push({
          rowIdx: r,
          inputs: [...row.inputs],
          expectedOutputs: [...row.outputs],
          actualOutputs,
          passed: rowMatch
        });
      }
    } finally {
      // Restore switch state
      this.engine.switches = savedSwitches;
      this.engine.simulate();
    }

    // Include floating input warnings if any
    if (initialSim.warnings.length > 0) {
      report.warnings.push(...initialSim.warnings);
    }

    // 5. Final Evaluation
    if (allRowsPassed) {
      report.passed = true;
      report.instructorRemarks.push(
        '✓ VERIFIED & APPROVED BY LAB INSTRUCTOR',
        'Circuit connections are neat and accurate. All truth table states confirmed experimentally.'
      );
    } else {
      report.passed = false;
      const failedCount = report.rowResults.filter(r => !r.passed).length;
      report.instructorRemarks.push(
        `✗ Verification Failed: ${failedCount} truth-table row(s) mismatched actual LED output.`,
        'Please cross-check patch cord routing against the manual circuit diagram.'
      );
    }

    return report;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LabVerifier };
}
