import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, Subject } from 'rxjs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcMessage, StimulatorStateChangeMessage } from '@diplomka-backend/stim-feature-ipc/domain';
import { IpcBlockingCommandFailedEvent } from '../../event/impl/ipc-blocking-command-failed.event';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSendStimulatorStateChangeCommand } from '../impl/ipc-send-stimulator-state-change.command';
import { IpcSendStimulatorStateChangeHandler } from './ipc-send-stimulator-state-change.handler';

describe('IpcSendStimulatorStateChangeHandler', () => {
  const defaultIpcRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: IpcSendStimulatorStateChangeHandler;
  let service: MockType<IpcService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let settingsFacade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcSendStimulatorStateChangeHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock,
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

    handler = testingModule.get<IpcSendStimulatorStateChangeHandler>(IpcSendStimulatorStateChangeHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    // @ts-ignore
    settingsFacade = testingModule.get<MockType<SettingsFacade>>(SettingsFacade);
    settingsFacade.getSettings.mockReturnValue({ assetPlayerResponseTimeout: defaultIpcRequestTimeout });
    Object.defineProperty(service, 'status', {
      get: jest.fn(() => ConnectionStatus.CONNECTED),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const state = 2;
    const waitForResponse = false;
    const requestMessage: StimulatorStateChangeMessage = new StimulatorStateChangeMessage(state);
    const command = new IpcSendStimulatorStateChangeCommand(state, waitForResponse);

    await handler.execute(command);

    expect(service.send).toBeCalledWith(requestMessage);
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const state = 2;
    const waitForResponse = true;
    const commandID = 1;
    const requestMessage: StimulatorStateChangeMessage = new StimulatorStateChangeMessage(state, commandID);
    const ipcMessage: IpcMessage<void> = { commandID, topic: 'test', data: null };
    const event: IpcEvent<void> = new IpcEvent(ipcMessage);
    const command = new IpcSendStimulatorStateChangeCommand(state, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.send.mockImplementationOnce(() => {
      subject.next(event);
      return Promise.resolve();
    });

    await handler.execute(command);

    expect(service.send).toBeCalledWith(requestMessage);
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should reject when callServiceMethod throw an error', () => {
    const state = 2;
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcSendStimulatorStateChangeCommand(state, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.send.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new Error());
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should reject when timeout', async () => {
    const state = 2;
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcSendStimulatorStateChangeCommand(state, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockImplementationOnce((...filters) => {
      let sub: Observable<any> = subject;
      for (const filter1 of filters) {
        sub = sub.pipe(filter1);
      }
      return sub;
    });
    service.send.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, defaultIpcRequestTimeout * 2);
      });
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(service.send).toBeCalled();
      expect(eventBus.publish).toBeCalledWith(new IpcBlockingCommandFailedEvent('stimulator-state-change'));
   }
  });
});
