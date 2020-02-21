import * as fs from 'fs';
import { Schema, Validator, ValidatorResult } from 'jsonschema';

import {
  createEmptyExperimentCVEP,
  createEmptyExperimentERP,
  createEmptyExperimentFVEP,
  createEmptyExperimentResult,
  createEmptyExperimentTVEP,
  createEmptyOutputERP, createEmptyOutputFVEP, createEmptyOutputTVEP,
  createEmptySequence,
  Experiment,
  ExperimentCVEP, ExperimentERP, ExperimentFVEP,
  ExperimentResult, ExperimentTVEP,
  ExperimentType,
  Sequence,
} from '@stechy1/diplomka-share';

describe('Schema validation', () => {

  const TOTAL_OUTPUT_COUNT = 8;

  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  function loadSchema(schema: string): Schema {
    return JSON.parse(fs.readFileSync(`schemas/${schema}.json`, { encoding: 'utf-8' }));
  }

  function validate(instance: any, schemaName: string, valid: boolean = true, errorLength: number = 0) {
    const schema: Schema = loadSchema(schemaName);
    const result: ValidatorResult = validator.validate(instance, schema);

    expect(result.errors).toHaveLength(errorLength);
    expect(result.valid).toBe(valid);
  }

  function createEmptyExperimentWithOutputERP(): ExperimentERP {
    const experimentERP: ExperimentERP = createEmptyExperimentERP();
    experimentERP.id = 1;
    for (let i = 0; i < (TOTAL_OUTPUT_COUNT + 1); i++) {
      experimentERP.outputs.push(createEmptyOutputERP(experimentERP, i));
    }
    return experimentERP;
  }

  function createEmptyExperimentWithOutputFVEP(): ExperimentFVEP {
    const experimentFVEP: ExperimentFVEP = createEmptyExperimentFVEP();
    experimentFVEP.id = 1;
    for (let i = 0; i < TOTAL_OUTPUT_COUNT; i++) {
      experimentFVEP.outputs.push(createEmptyOutputFVEP(experimentFVEP, i));
    }
    return experimentFVEP;
  }

  function createEmptyExperimentWithOutputTVEP(): ExperimentTVEP {
    const experimentTVEP: ExperimentTVEP = createEmptyExperimentTVEP();
    experimentTVEP.id = 1;
    for (let i = 0; i < TOTAL_OUTPUT_COUNT; i++) {
      experimentTVEP.outputs.push(createEmptyOutputTVEP(experimentTVEP, i));
    }
    return experimentTVEP;
  }


  describe('Quick schema validation for empty experiments', () => {

    const EXPERIMENT_TEST_CASES = [
      { name: 'ERP', schema: 'experiment-erp', function: createEmptyExperimentWithOutputERP },
      { name: 'CVEP', schema: 'experiment-cvep', function: createEmptyExperimentCVEP },
      { name: 'FVEP', schema: 'experiment-fvep', function: createEmptyExperimentWithOutputFVEP },
      { name: 'TVEP', schema: 'experiment-tvep', function: createEmptyExperimentWithOutputTVEP },
    ];

    // ------------- General empty experiment tests -------------

    EXPERIMENT_TEST_CASES.forEach(test => {
      it(`Empty experiment ${test.name} should be valid`, () => {
        const experiment: Experiment = test.function();
        experiment.id = 1;
        experiment.name = 'test';

        validate(experiment, test.schema);
      });
    });

    it('Empty experiment result should be valid', () => {
      const experiment: Experiment = createEmptyExperimentCVEP();
      experiment.id = 1;
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;

      validate(experimentResult, 'experiment-result');
    });

    it('Empty sequence should be valid', () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      sequence.experimentId = 1;
      sequence.name = 'test';
      sequence.size = 1;
      sequence.data = [0];

      validate(sequence, 'sequence');
    });
  });

  // ------------------ ERP experiment tests ------------------
  describe('ERP Experiment validation', () => {

    const ERP_PARAMETER_TESTCASES = [
      {message: `ERP missing ID.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `ERP missing name.`, parameter: 'name', value: undefined, valid: false, errorLength: 1},
      {message: `ERP has invalid type.`, parameter: 'type', value: ExperimentType.NONE, valid: false, errorLength: 1},
      {message: `ERP has no usedOutput defined.`, parameter: 'usedOutputs', value: {}, valid: false, errorLength: 1},
      {message: `ERP has too few outputs.`, parameter: 'outputCount', value: 0, valid: false, errorLength: 1},
      {message: `ERP has too many outputs.`, parameter: 'outputCount', value: 9, valid: false, errorLength: 1},
      {message: `ERP 'out' parameter out of minimum range.`, parameter: 'out', value: -1, valid: false, errorLength: 1},
      {message: `ERP 'wait' parameter out of minimum range.`, parameter: 'wait', value: -1, valid: false, errorLength: 1},
    ];

    const ERP_OUTPUT_PARAMETER_TESTCASES = [
      {message: `ERP output missing ID.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `ERP output missing experimentId.`, parameter: 'experimentId', value: undefined, valid: false, errorLength: 1},
      {message: `ERP output missing orderId.`, parameter: 'orderId', value: undefined, valid: false, errorLength: 1},
      {message: `ERP output 'orderId. parameter out of minimum range.`, parameter: 'orderId', value: -1, valid: false, errorLength: 1},
      {message: `ERP output 'orderId' parameter out of maximum range..`, parameter: 'orderId', value: 9, valid: false, errorLength: 1},
      {message: `ERP has no usedOutput defined.`, parameter: 'usedOutputs', value: {}, valid: false, errorLength: 1},
      {message: `ERP output missing pulseUp.`, parameter: 'pulseUp', value: undefined, valid: false, errorLength: 1},
      {message: `ERP output 'pulseUp. parameter out of minimum range.`, parameter: 'pulseUp', value: 0, valid: false, errorLength: 1},
      {message: `ERP output missing pulseDown.`, parameter: 'pulseDown', value: undefined, valid: false, errorLength: 1},
      {message: `ERP output 'pulseDown. parameter out of minimum range.`, parameter: 'pulseDown', value: 0, valid: false, errorLength: 1},
      {message: `ERP output missing distribution.`, parameter: 'distribution', value: undefined, valid: false, errorLength: 1},
      {message: `ERP output 'distribution. parameter out of minimum range.`, parameter: 'distribution', value: 0, valid: false, errorLength: 1},
      {message: `ERP output missing brightness.`, parameter: 'brightness', value: undefined, valid: false, errorLength: 1},
      {message: `ERP 'brightness' parameter out of minimum range.`, parameter: 'brightness', value: -1, valid: false, errorLength: 1},
      {message: `ERP 'brightness' parameter out of maximum range.`, parameter: 'brightness', value: 101, valid: false, errorLength: 1},
    ];

    function validateERPParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const experiment: ExperimentERP = createEmptyExperimentWithOutputERP();
        experiment.id = 1;
        experiment.name = 'test';
        experiment[parameter] = value;

        validate(experiment, 'experiment-erp', valid, errorLength);
      });
    }

    function validateOutputERPParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const experiment: ExperimentERP = createEmptyExperimentWithOutputERP();
        experiment.id = 1;
        experiment.name = 'test';
        experiment.outputs[0][parameter] = value;

        validate(experiment, 'experiment-erp', valid, errorLength);
      });
    }

    ERP_PARAMETER_TESTCASES.forEach(test => {
      validateERPParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });

    ERP_OUTPUT_PARAMETER_TESTCASES.forEach(test => {
      validateOutputERPParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });
  });

  // ----------------- CVEP experiment tests ------------------
  describe('CVEP Experiment validation', () => {

    const CVEP_PARAMETER_TESTCASES = [
      {message: `CVEP missing id.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `CVEP missing name.`, parameter: 'name', value: undefined, valid: false, errorLength: 1},
      {message: `CVEP has invalid type.`, parameter: 'type', value: ExperimentType.NONE, valid: false, errorLength: 1},
      {message: `CVEP has no usedOutput defined.`, parameter: 'usedOutputs', value: {}, valid: false, errorLength: 1},
      {message: `CVEP has too few outputs.`, parameter: 'outputCount', value: 0, valid: false, errorLength: 1},
      {message: `CVEP has too many outputs.`, parameter: 'outputCount', value: 9, valid: false, errorLength: 1},
      {message: `CVEP 'out' parameter out of minimum range.`, parameter: 'out', value: -1, valid: false, errorLength: 1},
      {message: `CVEP 'wait' parameter out of minimum range.`, parameter: 'wait', value: -1, valid: false, errorLength: 1},
      {message: `CVEP 'bitShift' parameter out of minimum range.`, parameter: 'bitShift', value: -1, valid: false, errorLength: 1},
      {message: `CVEP 'bitShift' parameter out of maximum range.`, parameter: 'bitShift', value: 32, valid: false, errorLength: 1},
      {message: `CVEP 'brightness' parameter out of minimum range.`, parameter: 'brightness', value: -1, valid: false, errorLength: 1},
      {message: `CVEP 'brightness' parameter out of maximum range.`, parameter: 'brightness', value: 101, valid: false, errorLength: 1},
    ];

    function validateCVEPParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const experiment: ExperimentCVEP = createEmptyExperimentCVEP();
        if (parameter !== 'id') {
          experiment.id = 1;
        }
        experiment.name = 'test';
        experiment[parameter] = value;

        validate(experiment, 'experiment-cvep', valid, errorLength);
      });
    }

    CVEP_PARAMETER_TESTCASES.forEach(test => {
      validateCVEPParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });
  });

  // ----------------- FVEP experiment tests ------------------
  describe('FVEP Experiment validation', () => {

    const FVEP_PARAMETER_TESTCASES = [
      {message: `FVEP missing id.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `FVEP missing name.`, parameter: 'name', value: undefined, valid: false, errorLength: 1},
      {message: `FVEP has invalid type.`, parameter: 'type', value: ExperimentType.NONE, valid: false, errorLength: 1},
      {message: `FVEP has no usedOutput defined.`, parameter: 'usedOutputs', value: {}, valid: false, errorLength: 1},
      {message: `FVEP has too few outputs.`, parameter: 'outputCount', value: 0, valid: false, errorLength: 1},
      {message: `FVEP has too many outputs.`, parameter: 'outputCount', value: 9, valid: false, errorLength: 1},
    ];

    function validateFVEPParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const experiment: ExperimentFVEP = createEmptyExperimentWithOutputFVEP();
        experiment.id = 1;
        experiment.name = 'test';
        experiment[parameter] = value;

        validate(experiment, 'experiment-fvep', valid, errorLength);
      });
    }

    FVEP_PARAMETER_TESTCASES.forEach(test => {
      validateFVEPParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });
  });

  // ----------------- TVEP experiment tests ------------------
  describe('TVEP Experiment validation', () => {

    const TVEP_PARAMETER_TESTCASES = [
      {message: `TVEP missing id.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `TVEP missing name.`, parameter: 'name', value: undefined, valid: false, errorLength: 1},
      {message: `TVEP has invalid type.`, parameter: 'type', value: ExperimentType.NONE, valid: false, errorLength: 1},
      {message: `TVEP has no usedOutput defined.`, parameter: 'usedOutputs', value: {}, valid: false, errorLength: 1},
      {message: `TVEP has too few outputs.`, parameter: 'outputCount', value: 0, valid: false, errorLength: 1},
      {message: `TVEP has too many outputs.`, parameter: 'outputCount', value: 9, valid: false, errorLength: 1},
    ];

    function validateTVEPParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const experiment: ExperimentTVEP = createEmptyExperimentWithOutputTVEP();
        experiment.id = 1;
        experiment.name = 'test';
        experiment[parameter] = value;

        validate(experiment, 'experiment-tvep', valid, errorLength);
      });
    }

    TVEP_PARAMETER_TESTCASES.forEach(test => {
      validateTVEPParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });
  });

  // --------------- Experiment results tests -----------------
  describe('Experiment result validation', () => {

    const EXPERIMENT_RESULT_PARAMETER_TESTCASES = [
      {message: `Experiment result has missing ID.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `Experiment result has missing experiment ID.`, parameter: 'experimentID', value: undefined, valid: false, errorLength: 1},
      {message: `Experiment result has invalid type.`, parameter: 'type', value: ExperimentType.NONE, valid: false, errorLength: 1},
      {message: `Experiment result has too few outputs.`, parameter: 'outputCount', value: 0, valid: false, errorLength: 1},
      {message: `Experiment result has too many outputs.`, parameter: 'outputCount', value: 9, valid: false, errorLength: 1},
      {message: `Experiment result has missing date.`, parameter: 'date', value: undefined, valid: false, errorLength: 1},
      {message: `Experiment result has missing data filename.`, parameter: 'filename', value: undefined, valid: false, errorLength: 1},
    ];

    function validateExperimentResultParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const experiment: ExperimentCVEP = createEmptyExperimentCVEP();
        experiment.id = 1;
        const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
        if (parameter !== 'id') {
          experimentResult.id = 1;
        }
        experimentResult[parameter] = value;

        validate(experimentResult, 'experiment-result', valid, errorLength);
      });
    }

    EXPERIMENT_RESULT_PARAMETER_TESTCASES.forEach(test => {
      validateExperimentResultParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });
  });

  // -------------------- Sequence tests ----------------------
  describe('Sequencevalidation', () => {

    const SEQUENCE_PARAMETER_TESTCASES = [
      {message: `Sequence has missing ID.`, parameter: 'id', value: undefined, valid: false, errorLength: 1},
      {message: `Sequence has missing experiment ID.`, parameter: 'experimentId', value: undefined, valid: false, errorLength: 1},
      {message: `Sequence has missing name.`, parameter: 'name', value: undefined, valid: false, errorLength: 1},
      {message: `Sequence has missing data.`, parameter: 'data', value: [], valid: false, errorLength: 1},
      {message: `Sequence 'size' parameter out of minimum range.`, parameter: 'size', value: 0, valid: false, errorLength: 1},
      {message: `Sequence contains duplicated tags.`, parameter: 'tags', value: ['ab', 'ab'], valid: false, errorLength: 1},
    ];

    function validateSequenceParameter(message: string, parameter: string, value: any, valid: boolean = true, errorLength: number = 0) {
      it(message, () => {
        const sequence: Sequence = createEmptySequence();
        sequence.id = 1;
        sequence.experimentId = 1;
        sequence.name = 'test';
        sequence.data = [0];
        sequence.size = 1;
        sequence[parameter] = value;

        validate(sequence, 'sequence', valid, errorLength);
      });
    }

    SEQUENCE_PARAMETER_TESTCASES.forEach(test => {
      validateSequenceParameter(test.message, test.parameter, test.value, test.valid, test.errorLength);
    });
  });
});
