import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, Subject } from 'rxjs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { ServerPublicPathMessage, IpcMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcBlockingCommandFailedEvent } from '../../event/impl/ipc-blocking-command-failed.event';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcSetPublicPathCommand } from '../impl/ipc-set-public-path.command';
import { IpcSetPublicPathHandler } from './ipc-set-public-path.handler';

describe('IpcSetPublicPathHandler', () => {
  const defaultIpcRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: IpcSetPublicPathHandler;
  let service: MockType<IpcService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcSetPublicPathHandler,
        {
          provide: IpcService,
          useFactory: createIpcServiceMock,
        },
        {
          provide: CommandIdService,
          useFactory: createCommandIdServiceMock,
        },
        queryBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcSetPublicPathHandler>(IpcSetPublicPathHandler);
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
      get: jest.fn(() => ConnectionStatus.CONNECTED),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const publicPath = 'test/path';
    const waitForResponse = false;
    const command = new IpcSetPublicPathCommand(publicPath, waitForResponse);
    const requestMessage: ServerPublicPathMessage = new ServerPublicPathMessage(publicPath);

    await handler.execute(command);

    expect(service.send).toBeCalledWith(requestMessage);
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const publicPath = 'test/path';
    const waitForResponse = true;
    const commandID = 1;
    const requestMessage: ServerPublicPathMessage = new ServerPublicPathMessage(publicPath, commandID);
    const responseMessage: IpcMessage<void> = { commandID, topic: 'test', data: null };
    const event: IpcEvent<void> = new IpcEvent(responseMessage);
    const command = new IpcSetPublicPathCommand(publicPath, waitForResponse);
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

  it('negative - should reject when callServiceMethod throw an error', async () => {
    const publicPath = 'test/path';
    const waitForResponse = true;
    const commandID = 1;
    const command = new IpcSetPublicPathCommand(publicPath, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.send.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrowError()
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should reject when timeout', async () => {
    const publicPath = 'test/path';
    const waitForResponse = true;
    const commandID = 1;
    const requestMessage: ServerPublicPathMessage = new ServerPublicPathMessage(publicPath, commandID);
    const command = new IpcSetPublicPathCommand(publicPath, waitForResponse);
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
      expect(service.send).toBeCalledWith(requestMessage);
      expect(eventBus.publish).toBeCalledWith(new IpcBlockingCommandFailedEvent('server-public-path'));
    }
  });
});
