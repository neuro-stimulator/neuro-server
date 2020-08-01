import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { ExperimentClearedHandler } from './experiment-cleared.handler';
import { ExperimentClearedEvent } from '@diplomka-backend/stim-feature-stimulator/application';
import { ExperimentResultClearCommand } from '../../commands/impl/experiment-result-clear.command';

describe('ExperimentClearedHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentClearedHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentClearedHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentClearedHandler>(ExperimentClearedHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should call experiment result clear command when no next round is available', async () => {
    const nextRoundAvailable = false;
    const event = new ExperimentClearedEvent();

    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new ExperimentResultClearCommand());
  });

  it('positive - should not call experiment result clear command when next round is available', async () => {
    const nextRoundAvailable = true;
    const event = new ExperimentClearedEvent();

    Object.defineProperty(service, 'nextRoundAvailable', {
      get: jest.fn(() => nextRoundAvailable),
    });

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalledWith(new ExperimentResultClearCommand());
  });
});
