import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateNewFolderCommand } from '@neuro-server/stim-feature-file-browser/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { InitializeExperimentResultsDirectoryCommand } from '../impl/initialize-experiment-results-directory.command';

import { InitializeExperimentResultsDirectoryHandler } from './initialize-experiment-results-directory.handler';

describe('InitializeExperimentResultsDirectoryHandler', () => {
  let testingModule: TestingModule;
  let handler: InitializeExperimentResultsDirectoryHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        InitializeExperimentResultsDirectoryHandler,
        commandBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<InitializeExperimentResultsDirectoryHandler>(InitializeExperimentResultsDirectoryHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should initialize experiment results directory', async () => {
    const command = new InitializeExperimentResultsDirectoryCommand();

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new CreateNewFolderCommand(`${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}`, 'private'));
  });
});
