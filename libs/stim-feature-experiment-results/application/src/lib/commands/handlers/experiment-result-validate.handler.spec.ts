import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { EXPERIMENT_RESULT_INSERT_GROUP, ExperimentResultNotValidException } from '@neuro-server/stim-feature-experiment-results/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw exception when not valid', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultValidateCommand(experimentResult);

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultNotValidException(experimentResult, []));
  });
});
