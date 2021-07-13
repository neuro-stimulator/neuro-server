import { Test, TestingModule } from '@nestjs/testing';

import { createAllTypesExperiments, createEmptyExperiment, createEmptyOutputByType, Experiment, Output } from '@stechy1/diplomka-share';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentProtocolCodec } from './experiment.protocol.codec';

describe('ExperimentProtocolCodec', () => {

  const COMMAND_ID = 1;
  const SEQUENCE_SIZE = 10;
  const TOTAL_OUTPUT_COUNT = 8;

  let testingModule: TestingModule;
  let factory: ExperimentProtocolCodec;

  beforeEach( async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentProtocolCodec
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    factory = testingModule.get<ExperimentProtocolCodec>(ExperimentProtocolCodec);
  });

  it('positive - should be defined', () => {
    expect(factory).toBeDefined();
  });

  test.each(createAllTypesExperiments())(
    'positive - should encode/decode experiment %s', (experiment: Experiment<Output>) => {
      experiment.outputCount = TOTAL_OUTPUT_COUNT;
      experiment.outputs = new Array(experiment.outputCount).fill(0).map((value, index: number) => createEmptyOutputByType(experiment, index));
    const buffer: Buffer = factory.encodeExperiment(experiment, COMMAND_ID, SEQUENCE_SIZE);
    const decodedExperiment = factory.decodeExperiment(buffer);

    expect(decodedExperiment.type).toEqual(experiment.type);
  });

  it('negative - should throw error when unknown experiment type', () => {
    const experiment = createEmptyExperiment();

    expect(() => factory.encodeExperiment(experiment, COMMAND_ID)).toThrow(new Error('Experiment type not supported'));
  })

});
