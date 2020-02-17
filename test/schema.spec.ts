import * as fs from 'fs';
import { Schema, Validator, ValidatorResult } from 'jsonschema';

import {
  createEmptyExperimentERP,
  createEmptyExperimentCVEP,
  createEmptyExperimentFVEP,
  createEmptyExperimentTVEP,
  Experiment, createEmptyExperimentResult, ExperimentResult, Sequence, createEmptySequence,
} from '@stechy1/diplomka-share';

function loadSchema(schema: string): Schema {
  return JSON.parse(fs.readFileSync(`schemas/${schema}.json`, { encoding: 'utf-8' }));
}

describe('Quick schema validation for empty experiments', () => {

  const EXPERIMENT_TEST_CASES = [
    {name: 'ERP', schema: 'experiment-erp', function: createEmptyExperimentERP},
    {name: 'CVEP', schema: 'experiment-cvep', function: createEmptyExperimentCVEP},
    {name: 'FVEP', schema: 'experiment-fvep', function: createEmptyExperimentFVEP},
    {name: 'TVEP', schema: 'experiment-tvep', function: createEmptyExperimentTVEP},
  ];

  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  EXPERIMENT_TEST_CASES.forEach(test => {
    it(`Empty experiment ${test.name} should be valid`, () => {
      const experiment: Experiment = test.function();
      const schema: Schema = loadSchema(test.schema);
      const result: ValidatorResult = validator.validate(experiment, schema);

      expect(result.errors).toHaveLength(0);
      expect(result.valid).toBeTruthy();
    });
  });

  it('Empty experiment result should be valid', () => {
    const experiment: Experiment = createEmptyExperimentCVEP();
    experiment.id = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    experimentResult.id = 1;
    const schema: Schema = loadSchema('experiment-result');
    const result: ValidatorResult = validator.validate(experimentResult, schema);

    expect(result.errors).toHaveLength(0);
    expect(result.valid).toBeTruthy();
  });

  it('Empty sequence should be valid', () => {
    const sequence: Sequence = createEmptySequence();
    sequence.experimentId = 1;

    const schema: Schema = loadSchema('sequence');
    const result: ValidatorResult = validator.validate(sequence, schema);

    expect(result.errors).toHaveLength(0);
    expect(result.valid).toBeTruthy();
  });
});
