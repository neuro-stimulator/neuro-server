import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { interval, Observable, Subject } from 'rxjs';
import DoneCallback = jest.DoneCallback;

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { ToggleOutputMessage, IpcMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcBlockingCommandFailedEvent } from '../../event/impl/ipc-blocking-command-failed.event';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcToggleOutputCommand } from '../impl/ipc-toggle-output.command';
import { IpcToggleOutputHandler } from './ipc-toggle-output.handler';

describe('IpcToggleOutputHandler', () => {
  const defaultIpcRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: IpcToggleOutputHandler;
  let service: MockType<IpcService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let settingsFacade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcToggleOutputHandler,
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

    handler = testingModule.get<IpcToggleOutputHandler>(IpcToggleOutputHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    // @ts-ignore
    settingsFacade = testingModule.get<MockType<SettingsFacade>>(SettingsFacade);
    settingsFacade.getSettings.mockReturnValue({ assetPlayerResponseTimeout: defaultIpcRequestTimeout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const index = 1;
    const waitForResponse = false;
    const command = new IpcToggleOutputCommand(index, waitForResponse);
    const requestMessage: ToggleOutputMessage = new ToggleOutputMessage(index);

    await handler.execute(command);

    expect(service.send).toBeCalledWith(requestMessage);
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const index = 1;
    const waitForResponse = true;
    const commandID = 1;
    const requestMessage: ToggleOutputMessage = new ToggleOutputMessage(index, commandID);
    const responseMessage: IpcMessage<void> = { commandID, topic: 'test', data: null };
    const event: IpcEvent<void> = new IpcEvent(responseMessage);
    const command = new IpcToggleOutputCommand(index, waitForResponse);
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

  it('negative - should reject when callServiceMethod throw an error', async (done: DoneCallback) => {
    const index = 1;
    const waitForResponse = true;
    const commandID = 1;
    const requestMessage: ToggleOutputMessage = new ToggleOutputMessage(index, commandID);
    const command = new IpcToggleOutputCommand(index, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.send.mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail();
    } catch (e) {
      expect(service.send).toBeCalledWith(requestMessage);
      expect(eventBus.publish).not.toBeCalled();
      done();
    }
  });

  it('negative - should reject when timeout', async (done: DoneCallback) => {
    const index = 1;
    const waitForResponse = true;
    const commandID = 1;
    const requestMessage: ToggleOutputMessage = new ToggleOutputMessage(index, commandID);
    const command = new IpcToggleOutputCommand(index, waitForResponse);
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
      return interval(defaultIpcRequestTimeout * 2).toPromise();
    });

    try {
      await handler.execute(command);
      done.fail();
    } catch (e) {
      expect(service.send).toBeCalledWith(requestMessage);
      expect(eventBus.publish).toBeCalledWith(new IpcBlockingCommandFailedEvent('toggle-output'));
      done();
    }
  });
});
