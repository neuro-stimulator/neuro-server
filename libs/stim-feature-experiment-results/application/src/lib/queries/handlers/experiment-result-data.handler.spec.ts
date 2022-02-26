import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultIdNotFoundException } from '@neuro-server/stim-feature-experiment-results/domain';
import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultDataQuery } from '../impl/experiment-result-data.query';

import { ExperimentResultDataHandler } from './experiment-result-data.handler';

describe('ExperimentResultDataHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultDataHandler;
  let service: MockType<ExperimentResultsService>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultDataHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        queryBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultDataHandler>(ExperimentResultDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  afterEach(() => {
    service.byId.mockClear();
  });

  it('positive - should find experiment result data by id', async () => {
    const userGroups = [1];
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultDataQuery(userGroups, experimentResult.id);
    const expected = {};

    service.byId.mockReturnValue(experimentResult);
    queryBus.execute.mockReturnValue(expected);

    const result = await handler.execute(query);

    expect(result).toEqual(expected);
  });

  it('negative - should throw exception when experiment result not found', () => {
    const userGroups = [1];
    const experimentResultID = -1;
    const query = new ExperimentResultDataQuery(userGroups, experimentResultID);

    service.byId.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundException(experimentResultID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new ExperimentResultIdNotFoundException(experimentResultID));
  });

  it('negative - should throw exception when file with result data not found', () => {
    const userGroups = [1];
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultDataQuery(userGroups, experimentResult.id);
    const path = 'file/path';

    service.byId.mockReturnValue(experimentResult);
    queryBus.execute.mockImplementation(() => {
      throw new FileNotFoundException(path);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(path));
  });
});
