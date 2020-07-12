import { Test, TestingModule } from '@nestjs/testing';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { InitializeExperimentResultsDirectoryCommand } from '../impl/initialize-experiment-results-directory.command';
import { InitializeExperimentResultsDirectoryHandler } from './initialize-experiment-results-directory.handler';

describe('InitializeExperimentResultsDirectoryHandler', () => {
  let testingModule: TestingModule;
  let handler: InitializeExperimentResultsDirectoryHandler;
  let service: MockType<ExperimentResultsService>;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        InitializeExperimentResultsDirectoryHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({
            createNewFolder: jest.fn(),
          })),
        },
      ],
    }).compile();

    handler = testingModule.get<InitializeExperimentResultsDirectoryHandler>(InitializeExperimentResultsDirectoryHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  it('positive - should initialize experiment results directory', async () => {
    const command = new InitializeExperimentResultsDirectoryCommand();

    await handler.execute(command);

    expect(facade.createNewFolder).toBeCalledWith(`${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}`, 'private');
  });
});
