import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentAssets } from '@stechy1/diplomka-share';

import { IpcSetExperimentAssetCommand } from '@neuro-server/stim-feature-ipc/application';
import { GetCurrentExperimentIdQuery } from '@neuro-server/stim-feature-stimulator/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { SendAssetConfigurationToIpcCommand } from '../../impl/to-ipc/send-asset-configuration-to-ipc.command';

import { SendAssetConfigurationToIpcHandler } from './send-asset-configuration-to-ipc.handler';

describe('SendAssetConfigurationToIpcHandler', () => {
  let testingModule: TestingModule;
  let handler: SendAssetConfigurationToIpcHandler;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [SendAssetConfigurationToIpcHandler, queryBusProvider, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SendAssetConfigurationToIpcHandler>(SendAssetConfigurationToIpcHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should send asset configuration for defined experiment', async () => {
    const userGroups = [1];
    const experimentID = 1;
    const assets: ExperimentAssets = { image: [], audio: [] };
    const command = new SendAssetConfigurationToIpcCommand(userGroups, experimentID);

    queryBus.execute.mockReturnValueOnce(assets);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new IpcSetExperimentAssetCommand(assets));
    expect(queryBus.execute).not.toBeCalledWith(new GetCurrentExperimentIdQuery());
  });

  it('positive - should send asset configuration for active experiment', async () => {
    const userGroups = [1];
    const experimentID = 2;
    const assets: ExperimentAssets = { image: [], audio: [] };
    const command = new SendAssetConfigurationToIpcCommand(userGroups);

    queryBus.execute.mockReturnValueOnce(experimentID);
    queryBus.execute.mockReturnValueOnce(assets);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new IpcSetExperimentAssetCommand(assets));
  });
});
