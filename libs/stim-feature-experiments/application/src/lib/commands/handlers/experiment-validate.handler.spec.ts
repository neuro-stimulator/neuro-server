import { Test, TestingModule } from '@nestjs/testing';

import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { DtoFactory } from '@diplomka-backend/stim-lib-common';
import { EXPERIMENT_INSERT_GROUP, ExperimentDTO, ExperimentNotValidException } from '@diplomka-backend/stim-feature-experiments/domain';

import { ExperimentValidateCommand } from '../impl/experiment-validate.command';
import { ExperimentValidateHandler } from './experiment-validate.handler';

describe('ExperimentValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentValidateHandler;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentValidateHandler,
        {
          provide: DtoFactory,
          useFactory: jest.fn(() => ({
            getDTO: jest.fn().mockReturnValue(ExperimentDTO),
          })),
        },
      ],
    }).compile();

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

  it('negative - should throw exception when not valid', async (done: DoneCallback) => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    const command = new ExperimentValidateCommand(experiment);

    try {
      await handler.execute(command);
      done.fail('ExperimentNotValidException exception was thrown');
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        done();
      } else {
        done.fail('Unknown exception was thrown');
      }
    }
  });
});
