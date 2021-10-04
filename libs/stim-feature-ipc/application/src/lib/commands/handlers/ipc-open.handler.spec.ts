import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, Subject } from 'rxjs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { ASSET_PLAYER_MODULE_CONFIG_CONSTANT, AssetPlayerModuleConfig, IpcMessage } from '@diplomka-backend/stim-feature-ipc/domain';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcBlockingCommandFailedEvent } from '../../event/impl/ipc-blocking-command-failed.event';
import { IpcEvent } from '../../event/impl/ipc.event';
import { IpcWasOpenEvent } from '../../event/impl/ipc-was-open.event';
import { IpcOpenCommand } from '../impl/ipc-open.command';
import { IpcOpenHandler } from './ipc-open.handler';

describe('IpcOpenHandler', () => {
  const defaultIpcRequestTimeout = 1000;
  const defaultModuleConfig: AssetPlayerModuleConfig = {
    pythonPath: '',
    path: '',
    communicationPort: 8080,
    frameRate: 64,
    openPortAutomatically: false
  };

  let testingModule: TestingModule;
  let handler: IpcOpenHandler;
  let service: MockType<IpcService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let queryBus: MockType<QueryBus>;

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
          provide: ASSET_PLAYER_MODULE_CONFIG_CONSTANT,
          useValue: defaultModuleConfig
        },
        queryBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcOpenHandler>(IpcOpenHandler);
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
      get: jest.fn(() => ConnectionStatus.CLOSED),
    });
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

  it('negative - should reject when callServiceMethod throw an error', () => {
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

    expect(() => handler.execute(command)).rejects.toThrow(new Error());
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should reject when timeout', async () => {
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
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, defaultIpcRequestTimeout * 2);
      });
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(service.open).toBeCalled();
      expect(eventBus.publish).toBeCalledWith(new IpcBlockingCommandFailedEvent('ipc-open'));
    }
  });
});
