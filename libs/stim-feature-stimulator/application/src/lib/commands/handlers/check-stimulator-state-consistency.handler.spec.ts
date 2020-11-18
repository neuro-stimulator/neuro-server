import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { CheckStimulatorStateConsistencyCommand } from '../impl/check-stimulator-state-consistency.command';
import { ExperimentClearCommand } from '../impl/experiment-clear.command';
import { CheckStimulatorStateConsistencyHandler } from './check-stimulator-state-consistency.handler';

describe('CheckStimulatorStateConsistencyHandler', () => {
  let testingModule: TestingModule;
  let handler: CheckStimulatorStateConsistencyHandler;
  let service: MockType<StimulatorService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [CheckStimulatorStateConsistencyHandler, { provide: StimulatorService, useFactory: createStimulatorServiceMock }, commandBusProvider],
    }).compile();

    handler = testingModule.get<CheckStimulatorStateConsistencyHandler>(CheckStimulatorStateConsistencyHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should clear experiment when inconsistency detected', async () => {
    const receivedState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED;
    const lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED;
    const command = new CheckStimulatorStateConsistencyCommand(receivedState);

    Object.defineProperty(service, 'lastKnownStimulatorState', {
      get: jest.fn(() => lastKnownStimulatorState),
    });

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new ExperimentClearCommand(true, false));
  });

  it('negative - no inconsistency detected so no command is called', async () => {
    const receivedState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED;
    const lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_CLEARED;
    const command = new CheckStimulatorStateConsistencyCommand(receivedState);

    Object.defineProperty(service, 'lastKnownStimulatorState', {
      get: jest.fn(() => lastKnownStimulatorState),
    });

    await handler.execute(command);

    expect(commandBus.execute).not.toBeCalled();
  });
});
