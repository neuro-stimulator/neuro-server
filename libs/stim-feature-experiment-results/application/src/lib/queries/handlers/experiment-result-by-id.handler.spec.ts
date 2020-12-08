import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultIdNotFoundException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultByIdQuery } from '../impl/experiment-result-by-id.query';
import { ExperimentResultByIdHandler } from './experiment-result-by-id.handler';

describe('ExperimentResultByIdHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultByIdHandler;
  let service: MockType<ExperimentResultsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultByIdHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultByIdHandler>(ExperimentResultByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  afterEach(() => {
    service.byId.mockClear();
  });

  it('positive - should find experiment result by id', async () => {
    const userID = 0;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultByIdQuery(experimentResult.id, userID);

    service.byId.mockReturnValue(experimentResult);

    const result = await handler.execute(query);

    expect(result).toEqual(experimentResult);
  });

  it('negative - should throw exception when experiment result not found', async (done: DoneCallback) => {
    const userID = 0;
    const experimentResultID = -1;
    const query = new ExperimentResultByIdQuery(experimentResultID, userID);

    service.byId.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundException(experimentResultID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'ExperimentResultIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundException) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
