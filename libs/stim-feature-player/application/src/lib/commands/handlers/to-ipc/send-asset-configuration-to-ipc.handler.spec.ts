import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { ExperimentAssets } from '@stechy1/diplomka-share';

import { IpcSetExperimentAssetCommand } from '@diplomka-backend/stim-feature-ipc/application';
import { GetCurrentExperimentIdQuery } from '@diplomka-backend/stim-feature-stimulator/application';

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
    const userID = 1;
    const experimentID = 1;
    const assets: ExperimentAssets = { image: [], audio: [] };
    const command = new SendAssetConfigurationToIpcCommand(userID, experimentID);

    queryBus.execute.mockReturnValueOnce(assets);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new IpcSetExperimentAssetCommand(assets));
    expect(queryBus.execute).not.toBeCalledWith(new GetCurrentExperimentIdQuery());
  });

  it('positive - should send asset configuration for active experiment', async () => {
    const userID = 1;
    const experimentID = 2;
    const assets: ExperimentAssets = { image: [], audio: [] };
    const command = new SendAssetConfigurationToIpcCommand(userID);

    queryBus.execute.mockReturnValueOnce(experimentID);
    queryBus.execute.mockReturnValueOnce(assets);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new IpcSetExperimentAssetCommand(assets));
  });
});
