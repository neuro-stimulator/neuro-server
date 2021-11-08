import { Test, TestingModule } from '@nestjs/testing';

import { ConnectionStatus, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import {
  AssetPlayerAlreadyRunningException,
  AssetPlayerMainPathNotDefinedException,
  AssetPlayerNotRunningException,
  AssetPlayerPythonPathNotDefinedException,
  IpcAlreadyOpenException,
  NoIpcOpenException
} from '@neuro-server/stim-feature-ipc/domain';
import { ControllerException } from '@neuro-server/stim-lib-common';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createIpcFacadeMock } from '../service/ipc.facade.jest';
import { IpcFacade } from '../service/ipc.facade';
import { IpcController } from './ipc.controller';

describe('IpcController', () => {
  let testingModule: TestingModule;
  let controller: IpcController;
  let mockIpcFacade: MockType<IpcFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcController,
        {
          provide: IpcFacade,
          useFactory: createIpcFacadeMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    controller = testingModule.get<IpcController>(IpcController);
    // @ts-ignore
    mockIpcFacade = testingModule.get<MockType<IpcFacade>>(IpcFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('status()', () => {
    it('positive - should return whether ipc is connected or not', async () => {
      const status: ConnectionStatus = ConnectionStatus.DISCONNECTED;

      mockIpcFacade.status.mockReturnValue(status);

      const result: ResponseObject<{ status: ConnectionStatus }> = await controller.status();
      const expected: ResponseObject<{ status: ConnectionStatus }> = { data: { status } };

      expect(result).toEqual(expected);
    });
  });

  describe('spawn()', () => {
    it('positive - should spawn new asset player program', async () => {
      const result: ResponseObject<void> = await controller.spawn();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when IPC server is not running', () => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      expect(() => controller.spawn()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_NOT_OPEN));
    });

    it('negative - should throw exception when python path is not defined', () => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new AssetPlayerPythonPathNotDefinedException();
      });

      expect(() => controller.spawn()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_PYTHON_PATH_NOT_DEFINED));
    });

    it('negative - should throw exception when main.py path is not defined', () => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new AssetPlayerMainPathNotDefinedException();
      });

      expect(() => controller.spawn()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_PYTHON_PATH_NOT_DEFINED));
    });

    it('negative - should throw exception when asset player already running', () => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new AssetPlayerAlreadyRunningException();
      });

      expect(() => controller.spawn()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_PLAYER_ALREADY_RUNNING));
    });

    it('negative - should throw exception when unexpected error occured', () => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.spawn()).rejects.toThrow(new ControllerException());
    });
  });

  describe('kill()', () => {
    it('positive - should kill running asset player program', async () => {
      const result: ResponseObject<void> = await controller.kill();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when asset player not running', () => {
      mockIpcFacade.kill.mockImplementationOnce(() => {
        throw new AssetPlayerNotRunningException();
      });

      expect(() => controller.kill()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_PLAYER_NOT_RUNNING));
    });

    it('negative - should throw exception when unexpected error occured', () => {
      mockIpcFacade.kill.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.kill()).rejects.toThrow(new ControllerException());
    });
  });

  describe('open()', () => {
    it('positive - should start ipc server', async () => {
      const result: ResponseObject<void> = await controller.open();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already started', () => {
      mockIpcFacade.open.mockImplementationOnce(() => {
        throw new IpcAlreadyOpenException();
      });

      expect(() => controller.open()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_ALREADY_OPEN));
    });

    it('negative - should throw an exception when unexpected error occured', () => {
      mockIpcFacade.open.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.open()).rejects.toThrow(new ControllerException());
    });
  });

  describe('close()', () => {
    it('positive - should stop ipc server', async () => {
      const result: ResponseObject<void> = await controller.close();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already stop', () => {
      mockIpcFacade.close.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      expect(() => controller.close()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_NOT_OPEN));
    });

    it('negative - should throw an exception when unexpected error occured', () => {
      mockIpcFacade.close.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.close()).rejects.toThrow(new ControllerException());
    });
  });
});
