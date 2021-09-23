import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultsAllQuery } from '../impl/experiment-results-all.query';
import { ExperimentResultsAllHandler } from './experiment-results-all.handler';

describe('ExperimentResultsAllHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultsAllHandler;
  let service: MockType<ExperimentResultsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultsAllHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultsAllHandler>(ExperimentResultsAllHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
  });

  afterEach(() => {
    service.findAll.mockClear();
  });

  it('positive - should get all experimentResults', async () => {
    const experimentResults: ExperimentResult[] = [createEmptyExperimentResult(createEmptyExperiment())];
    const userGroups = [1];
    const query = new ExperimentResultsAllQuery(userGroups);

    service.findAll.mockReturnValue(experimentResults);

    const result = await handler.execute(query);

    expect(result).toEqual(experimentResults);
    expect(service.findAll).toBeCalledWith({ userGroups: query.userGroups });
  });
});
