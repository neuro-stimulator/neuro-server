import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { FileBrowserFacade, FileNotFoundException } from '@diplomka-backend/stim-feature-file-browser';
import { ExperimentResultIdNotFoundException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultDataQuery } from '../impl/experiment-result-data.query';
import { ExperimentResultDataHandler } from './experiment-result-data.handler';

describe('ExperimentResultDataHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultDataHandler;
  let service: MockType<ExperimentResultsService>;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultDataHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({
            readPrivateJSONFile: jest.fn(),
          })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultDataHandler>(ExperimentResultDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  afterEach(() => {
    service.byId.mockClear();
    facade.readPrivateJSONFile.mockClear();
  });

  it('positive - should find experiment result data by id', async () => {
    const userID = 0;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultDataQuery(experimentResult.id, userID);
    const expected = {};

    service.byId.mockReturnValue(experimentResult);
    facade.readPrivateJSONFile.mockReturnValue(expected);

    const result = await handler.execute(query);

    expect(result).toEqual(expected);
  });

  it('negative - should throw exception when experiment result not found', () => {
    const userID = 0;
    const experimentResultID = -1;
    const query = new ExperimentResultDataQuery(experimentResultID, userID);

    service.byId.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundException(experimentResultID);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new ExperimentResultIdNotFoundException(experimentResultID));
  });

  it('negative - should throw exception when file with result data not found', () => {
    const userID = 0;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const query = new ExperimentResultDataQuery(experimentResult.id, userID);
    const path = 'file/path';

    service.byId.mockReturnValue(experimentResult);
    facade.readPrivateJSONFile.mockImplementation(() => {
      throw new FileNotFoundException(path);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(path));
  });
});
