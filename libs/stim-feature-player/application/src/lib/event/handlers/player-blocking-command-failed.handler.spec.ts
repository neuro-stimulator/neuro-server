import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { StimulatorBlockingCommandFailedEvent } from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorCommandType } from '@diplomka-backend/stim-feature-stimulator/domain';

import { PlayerBlockingCommandFailedHandler } from './player-blocking-command-failed.handler';
import { ExperimentResultClearCommand } from '../../commands/impl/experiment-result-clear.command';

describe('PlayerBlockingCommandFailedHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerBlockingCommandFailedHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerBlockingCommandFailedHandler, commandBusProvider],
    }).compile();

    handler = testingModule.get<PlayerBlockingCommandFailedHandler>(PlayerBlockingCommandFailedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("positive - should execute ExperimentResultClear command when event is 'upload'", async () => {
    const command: StimulatorCommandType = 'upload';
    const event = new StimulatorBlockingCommandFailedEvent(command);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new ExperimentResultClearCommand());
  });

  it("positive - should execute ExperimentResultClear command when event is 'setup'", async () => {
    const command: StimulatorCommandType = 'setup';
    const event = new StimulatorBlockingCommandFailedEvent(command);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new ExperimentResultClearCommand());
  });

  it('negative - should not execute any command', async () => {
    const command: StimulatorCommandType = 'run';
    const event = new StimulatorBlockingCommandFailedEvent(command);

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalled();
  });
});
