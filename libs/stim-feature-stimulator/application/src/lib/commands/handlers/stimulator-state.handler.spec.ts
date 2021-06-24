import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, Subject } from 'rxjs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StimulatorBlockingCommandFailedEvent } from '../../events/impl/stimulator-blocking-command-failed.event';
import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { SerialService } from '../../service/serial.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorStateCommand } from '../impl/stimulator-state.command';
import { StimulatorStateHandler } from './stimulator-state.handler';

describe('StimulatorStateHandler', () => {
  const defaultStimulatorRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: StimulatorStateHandler;
  let service: MockType<StimulatorService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let settingsFacade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StimulatorStateHandler,
        {
          provide: StimulatorService,
          useFactory: createStimulatorServiceMock,
        },
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
        {
          provide: CommandIdService,
          useFactory: createCommandIdServiceMock,
        },
        {
          provide: SettingsFacade,
          useFactory: jest.fn(() => ({ getSettings: jest.fn() })),
        },
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<StimulatorStateHandler>(StimulatorStateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    // @ts-ignore
    settingsFacade = testingModule.get<MockType<SettingsFacade>>(SettingsFacade);
    settingsFacade.getSettings.mockReturnValue({ stimulatorResponseTimeout: defaultStimulatorRequestTimeout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const waitForResponse = false;
    const command = new StimulatorStateCommand(waitForResponse);

    await handler.execute(command);

    expect(service.stimulatorState).toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const waitForResponse = true;
    const commandID = 1;
    const stimulatorStateData: StimulatorStateData = {
      state: 0,
      timestamp: Date.now(),
      noUpdate: true,
      name: 'StimulatorStateData',
    };
    const event: StimulatorEvent = new StimulatorEvent(commandID, stimulatorStateData);
    let lastKnownStimulatorState;
    const command = new StimulatorStateCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.stimulatorState.mockImplementationOnce(() => {
      subject.next(event);
      return Promise.resolve();
    });

    await handler.execute(command);

    expect(service.stimulatorState).toBeCalled();
    expect(lastKnownStimulatorState).toBe(stimulatorStateData.state);
  });

  it('negative - should reject when callServiceMethod throw an error', async () => {
    const waitForResponse = true;
    const commandID = 1;
    let lastKnownStimulatorState;
    const command = new StimulatorStateCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.stimulatorState.mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(lastKnownStimulatorState).toBeUndefined();
      expect(eventBus.publish).not.toBeCalled();
    }
  });

  it('negative - should reject when timeout', async () => {
    const waitForResponse = true;
    const commandID = 1;
    let lastKnownStimulatorState;
    const command = new StimulatorStateCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockImplementationOnce((...filters) => {
      let sub: Observable<any> = subject;
      for (const filter1 of filters) {
        sub = sub.pipe(filter1);
      }
      return sub;
    });
    service.stimulatorState.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, defaultStimulatorRequestTimeout * 2);
      });
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(service.stimulatorState).toBeCalled();
      expect(lastKnownStimulatorState).toBeUndefined();
      expect(eventBus.publish).toBeCalledWith(new StimulatorBlockingCommandFailedEvent('state'));
    }
  });
});
