import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StimulatorCommandType } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { SendStimulatorStateChangeToClientCommand } from '../../commands/impl/to-client/send-stimulator-state-change-to-client.command';
import { ExperimentClearCommand } from '../../commands/impl/experiment-clear.command';
import { StimulatorBlockingCommandFailedEvent } from '../impl/stimulator-blocking-command-failed.event';
import { StimulatorBlockingCommandFailedHandler } from './stimulator-blocking-command-failed.handler';

describe('StimulatorBlockingCommandFailedHandler', () => {
  let testingModule: TestingModule;
  let handler: StimulatorBlockingCommandFailedHandler;
  let service: MockType<StimulatorService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [StimulatorBlockingCommandFailedHandler, { provide: StimulatorService, useFactory: createStimulatorServiceMock }, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<StimulatorBlockingCommandFailedHandler>(StimulatorBlockingCommandFailedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should handle failed stimulator blocking command', async () => {
    const command: StimulatorCommandType = 'upload';
    const lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED;
    const event = new StimulatorBlockingCommandFailedEvent(command);

    Object.defineProperty(service, 'lastKnownStimulatorState', {
      get: jest.fn(() => lastKnownStimulatorState),
    });

    await handler.handle(event);

    expect(commandBus.execute.mock.calls[0]).toEqual([new SendStimulatorStateChangeToClientCommand(lastKnownStimulatorState)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new ExperimentClearCommand(false)]);
  });
});
