import { Observable, Subject } from 'rxjs';

import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { IpcMessage } from '@neuro-server/stim-feature-ipc/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { IpcBlockingCommandFailedEvent } from '../../event/impl/ipc-blocking-command-failed.event';
import { IpcClosedEvent } from '../../event/impl/ipc-closed.event';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcCloseCommand } from '../impl/ipc-close.command';

import { IpcCloseHandler } from './ipc-close.handler';

describe('IpcCloseHandler', () => {
  const defaultIpcRequestTimeout = 300;
  let testingModule: TestingModule;
  let handler: IpcCloseHandler;
  let service: MockType<IpcService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcCloseHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock
        },
        {
          provide: CommandIdService,
          useFactory: createCommandIdServiceMock
        },
        queryBusProvider,
        eventBusProvider
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcCloseHandler>(IpcCloseHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    queryBus.execute.mockReturnValue({ assetPlayerResponseTimeout: defaultIpcRequestTimeout });
    Object.defineProperty(service, 'status', {
      get: jest.fn(() => ConnectionStatus.DISCONNECTED)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const waitForResponse = false;
    const command = new IpcCloseCommand(waitForResponse);

    await handler.execute(command);

    expect(service.close).toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const waitForResponse = true;
    const commandID = 1;
    const ipcMessage: IpcMessage<void> = { commandID, topic: 'test', data: null };
    const event: IpcEvent<void> = new IpcEvent(ipcMessage);
    const command = new IpcCloseCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID)
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.close.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          subject.next(event);
          resolve(null);
        }, defaultIpcRequestTimeout * 2);
      });
    });

    await handler.execute(command);

    expect(service.close).toBeCalled();
    expect(eventBus.publish).toBeCalledWith(new IpcClosedEvent());
  });

  it('negative - should reject when callServiceMethod throw an error', () => {
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcCloseCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID)
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.close.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new Error());
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should reject when timeout', async () => {
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcCloseCommand(waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID)
    });
    eventBus.pipe.mockImplementationOnce((...filters) => {
      let sub: Observable<any> = subject;
      for (const filter1 of filters) {
        sub = sub.pipe(filter1);
      }
      return sub;
    });
    service.close.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, defaultIpcRequestTimeout * 2);
      });
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(service.close).toBeCalled();
      expect(eventBus.publish).toBeCalledWith(new IpcBlockingCommandFailedEvent('ipc-close'));
    }
  });
});
