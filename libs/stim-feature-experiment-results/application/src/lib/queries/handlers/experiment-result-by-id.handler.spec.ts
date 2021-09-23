import { Test, TestingModule } from '@nestjs/testing';

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
    const userGroups = [1];
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultByIdQuery(userGroups, experimentResult.id);

    service.byId.mockReturnValue(experimentResult);

    const result = await handler.execute(query);

    expect(result).toEqual(experimentResult);
  });

  it('negative - should throw exception when experiment result not found', () => {
    const userGroups = [1];
    const experimentResultID = -1;
    const query = new ExperimentResultByIdQuery(userGroups, experimentResultID);

    service.byId.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundException(experimentResultID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new ExperimentResultIdNotFoundException(experimentResultID));
  });
});
