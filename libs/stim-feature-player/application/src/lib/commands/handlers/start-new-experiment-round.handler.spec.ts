import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { StartNewExperimentRoundCommand } from '../impl/start-new-experiment-round.command';
import { CreateNewExperimentRoundToClientCommand } from '../impl/to-client/create-new-experiment-round-to-client.command';
import { FillInitialIoDataCommand } from '../impl/fill-initial-io-data.command';
import { SendAssetConfigurationToIpcCommand } from '../impl/to-ipc/send-asset-configuration-to-ipc.command';
import { StartNewExperimentRoundHandler } from './start-new-experiment-round.handler';

describe('StartNewExperimentRoundHandler', () => {
  let testingModule: TestingModule;
  let handler: StartNewExperimentRoundHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StartNewExperimentRoundHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<StartNewExperimentRoundHandler>(StartNewExperimentRoundHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should start new experiment round', async () => {
    const timestamp = 0;
    const userID = 1;
    const userGroups = [1];
    const command = new StartNewExperimentRoundCommand(timestamp);

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => userID),
    });
    Object.defineProperty(service, 'userGroups', {
      get: jest.fn(() => userGroups),
    });

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new CreateNewExperimentRoundToClientCommand()]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new FillInitialIoDataCommand(timestamp)]);
    expect(commandBus.execute.mock.calls[2]).toEqual([new SendAssetConfigurationToIpcCommand(userGroups)]);
  });

  it('negative - should not start new experiment when userID is not defined', async () => {
    const timestamp = 0;
    const command = new StartNewExperimentRoundCommand(timestamp);

    Object.defineProperty(service, 'userID', {
      get: jest.fn(() => undefined),
    });

    await handler.execute(command);

    expect(commandBus.execute).not.toBeCalled();
  });
});
