import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { ExperimentInitializedEvent } from '@neuro-server/stim-feature-stimulator/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StartNewExperimentRoundCommand } from '../../commands/impl/start-new-experiment-round.command';
import { PlayerExperimentInitializedHandler } from './player-experiment-initialized.handler';

describe('PlayerExperimentInitializedHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerExperimentInitializedHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerExperimentInitializedHandler, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<PlayerExperimentInitializedHandler>(PlayerExperimentInitializedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should send command for start new experiment round', async () => {
    const timestamp = 0;
    const event = new ExperimentInitializedEvent(timestamp);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new StartNewExperimentRoundCommand(timestamp));
  });
});
