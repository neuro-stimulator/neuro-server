import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultIdNotFoundError } from '../../../domain/exception/experiment-result-id-not-found.error';
import { ExperimentResultsService } from '../../../domain/services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../../domain/services/experiment-results.service.jest';
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

    handler = testingModule.get<ExperimentResultByIdHandler>(ExperimentResultByIdHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  afterEach(() => {
    service.byId.mockClear();
  });

  it('positive - should find experiment result by id', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultByIdQuery(experimentResult.id);

    service.byId.mockReturnValue(experimentResult);

    const result = await handler.execute(query);

    expect(result).toEqual(experimentResult);
  });

  it('negative - should throw exception when experiment result not found', async (done: DoneCallback) => {
    const experimentResultID = -1;
    const query = new ExperimentResultByIdQuery(experimentResultID);

    service.byId.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundError(experimentResultID);
    });

    try {
      await handler.execute(query);
      done.fail({ message: 'ExperimentResultIdNotFoundError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundError) {
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
