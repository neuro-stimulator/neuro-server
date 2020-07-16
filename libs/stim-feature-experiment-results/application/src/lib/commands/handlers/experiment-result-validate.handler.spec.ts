import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { EXPERIMENT_RESULT_INSERT_GROUP, ExperimentResultNotValidException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultValidateCommand } from '../impl/experiment-result-validate.command';
import { ExperimentResultValidateHandler } from './experiment-result-validate.handler';

describe('ExperimentResultValidateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultValidateHandler;
  let service: MockType<ExperimentResultsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultValidateHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultValidateHandler>(ExperimentResultValidateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  afterEach(() => {
    service.delete.mockClear();
  });

  it('positive - should validate experiment result', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultValidateCommand(experimentResult, [EXPERIMENT_RESULT_INSERT_GROUP]);

    const result = await handler.execute(command);

    expect(result).toBeTruthy();
  });

  it('negative - should throw exception when not valid', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultValidateCommand(experimentResult);

    try {
      await handler.execute(command);
      done.fail('ExperimentResultNotValidException exception was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
