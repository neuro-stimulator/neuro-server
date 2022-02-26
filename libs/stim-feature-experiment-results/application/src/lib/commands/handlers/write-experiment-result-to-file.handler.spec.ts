import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { CreateNewFolderCommand, MergePrivatePathQuery, WritePrivateJSONFileCommand } from '@neuro-server/stim-feature-file-browser/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { WriteExperimentResultToFileCommand } from '../impl/write-experiment-result-to-file.command';

import { WriteExperimentResultToFileHandler } from './write-experiment-result-to-file.handler';

describe('WriteExperimentResultToFileHandler', () => {
  let testingModule: TestingModule;
  let handler: WriteExperimentResultToFileHandler;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        WriteExperimentResultToFileHandler,
        queryBusProvider,
        commandBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<WriteExperimentResultToFileHandler>(WriteExperimentResultToFileHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should write experiment result data to file', async () => {
    const resultData = [];
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.filename = 'filename.json';
    const filePath = 'file/path';
    const command = new WriteExperimentResultToFileCommand(experimentResult, resultData);

    commandBus.execute.mockReturnValue(['parent', ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME]);
    queryBus.execute.mockReturnValue(filePath);

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([
      new CreateNewFolderCommand(ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME, 'private', false)]);
    expect(queryBus.execute.mock.calls[0]).toEqual([
      new MergePrivatePathQuery(`${ExperimentResultsService.EXPERIMENT_RESULTS_DIRECTORY_NAME}/${experimentResult.filename}`)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([
      new WritePrivateJSONFileCommand(filePath, resultData)]);
  });
});
