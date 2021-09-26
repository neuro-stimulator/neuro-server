import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { WriteExperimentResultToFileCommand } from '../impl/write-experiment-result-to-file.command';
import { WriteExperimentResultToFileHandler } from './write-experiment-result-to-file.handler';

describe('WriteExperimentResultToFileHandler', () => {
  let testingModule: TestingModule;
  let handler: WriteExperimentResultToFileHandler;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        WriteExperimentResultToFileHandler,
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({
            createNewFolder: jest.fn(),
            mergePrivatePath: jest.fn(),
            writePrivateJSONFile: jest.fn(),
          })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<WriteExperimentResultToFileHandler>(WriteExperimentResultToFileHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  afterEach(() => {
    facade.createNewFolder.mockClear();
    facade.mergePrivatePath.mockClear();
    facade.writePrivateJSONFile.mockClear();
  });

  it('positive - should write experiment result data to file', async () => {
    const resultData = [];
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.filename = 'filename.json';
    const filePath = 'file/path';
    const command = new WriteExperimentResultToFileCommand(experimentResult, resultData);

    facade.createNewFolder.mockReturnValue(['parent', ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME]);
    facade.mergePrivatePath.mockReturnValue(filePath);

    await handler.execute(command);

    expect(facade.createNewFolder).toBeCalledWith(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME, 'private', false);
    expect(facade.writePrivateJSONFile).toBeCalledWith(filePath, resultData);
  });
});
