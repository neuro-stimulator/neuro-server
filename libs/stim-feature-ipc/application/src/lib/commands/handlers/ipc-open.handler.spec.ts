import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { interval, Observable, Subject } from 'rxjs';
import DoneCallback = jest.DoneCallback;

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { IpcOpenHandler } from './ipc-open.handler';
import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { createCommandIdServiceMock } from '../../../../../../stim-lib-common/src/lib/command-id/command-id.service.jest';
import { IpcMessage } from '@diplomka-backend/stim-feature-ipc/domain';
import { IpcBlockingCommandFailedEvent } from '../../event/impl/ipc-blocking-command-failed.event';
import { IpcOpenCommand } from '../impl/ipc-open.command';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcWasOpenEvent } from '@diplomka-backend/stim-feature-ipc/application';

describe('IpcOpenHandler', () => {
  const defaultIpcRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: IpcOpenHandler;
  let service: MockType<IpcService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let settingsFacade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcOpenHandler,
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

    handler = testingModule.get<IpcOpenHandler>(IpcOpenHandler);
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
    const waitForResponse = false;
    const command = new IpcOpenCommand(waitForResponse);

    await handler.execute(command);

    expect(service.open).toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const waitForResponse = true;
    const commandID = 1;
    const ipcMessage: IpcMessage<void> = { commandID, topic: 'test', data: null };
    const event: IpcEvent<void> = new IpcEvent(ipcMessage);
    const command = new IpcOpenCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.open.mockImplementationOnce(() => {
      subject.next(event);
      return Promise.resolve();
    });

    await handler.execute(command);

    expect(service.open).toBeCalled();
    expect(eventBus.publish).toBeCalledWith(new IpcWasOpenEvent());
  });

  it('negative - should reject when callServiceMethod throw an error', async (done: DoneCallback) => {
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcOpenCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.open.mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail();
    } catch (e) {
      expect(service.open).toBeCalled();
      expect(eventBus.publish).not.toBeCalled();
      done();
    }
  });

  it('negative - should reject when timeout', async (done: DoneCallback) => {
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcOpenCommand(waitForResponse);
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
    service.open.mockImplementationOnce(() => {
      return interval(defaultIpcRequestTimeout * 2).toPromise();
    });

    try {
      await handler.execute(command);
      done.fail();
    } catch (e) {
      expect(service.open).toBeCalled();
      expect(eventBus.publish).toBeCalledWith(new IpcBlockingCommandFailedEvent('ipc-open'));
      done();
    }
  });
});
