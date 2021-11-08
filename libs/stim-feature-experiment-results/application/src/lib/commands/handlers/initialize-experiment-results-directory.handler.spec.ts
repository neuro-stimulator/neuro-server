import { Test, TestingModule } from '@nestjs/testing';

import { FileBrowserFacade } from '@neuro-server/stim-feature-file-browser';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { InitializeExperimentResultsDirectoryCommand } from '../impl/initialize-experiment-results-directory.command';
import { InitializeExperimentResultsDirectoryHandler } from './initialize-experiment-results-directory.handler';

describe('InitializeExperimentResultsDirectoryHandler', () => {
  let testingModule: TestingModule;
  let handler: InitializeExperimentResultsDirectoryHandler;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        InitializeExperimentResultsDirectoryHandler,
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({
            createNewFolder: jest.fn(),
          })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<InitializeExperimentResultsDirectoryHandler>(InitializeExperimentResultsDirectoryHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  it('positive - should initialize experiment results directory', async () => {
    const command = new InitializeExperimentResultsDirectoryCommand();

    await handler.execute(command);

    expect(facade.createNewFolder).toBeCalledWith(`${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}`, 'private');
  });
});
