import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, Experiment, ExperimentType, Output } from '@stechy1/diplomka-share';

import { DTO_SCOPE, EXPERIMENT_INSERT_GROUP, ExperimentDTO, ExperimentNotValidException } from '@neuro-server/stim-feature-experiments/domain';
import { createDtoProvider } from '@neuro-server/stim-lib-dto';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentValidateCommand } from '../impl/experiment-validate.command';

import { ExperimentValidateHandler } from './experiment-validate.handler';

describe('ExperimentValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentValidateHandler;

  beforeEach(async () => {
    // @ts-ignore
    const dtoProvider = createDtoProvider<ExperimentType>(DTO_SCOPE, () => {
      return {
        getDTO: jest.fn().mockReturnValue(ExperimentDTO),
      };
    });

    testingModule = await Test.createTestingModule({
      providers: [ExperimentValidateHandler, dtoProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentValidateHandler>(ExperimentValidateHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should validate experiment', async () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.name = 'name';
    const command = new ExperimentValidateCommand(experiment, [EXPERIMENT_INSERT_GROUP]);

    const result = await handler.execute(command);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when not valid', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    const command = new ExperimentValidateCommand(experiment);

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentNotValidException(experiment, []));
  });
});
