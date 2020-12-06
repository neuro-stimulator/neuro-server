import { Test, TestingModule } from '@nestjs/testing';

import { ConnectionStatus, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import {
  AssetPlayerAlreadyRunningException,
  AssetPlayerMainPathNotDefinedException,
  AssetPlayerNotRunningException,
  AssetPlayerPythonPathNotDefinedException,
  IpcAlreadyOpenException,
  NoIpcOpenException,
} from '@diplomka-backend/stim-feature-ipc/domain';
import { ControllerException } from '@diplomka-backend/stim-lib-common';

import { MockType } from 'test-helpers/test-helpers';

import { createIpcFacadeMock } from '../service/ipc.facade.jest';
import { IpcFacade } from '../service/ipc.facade';
import { IpcController } from './ipc.controller';
import DoneCallback = jest.DoneCallback;

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
          useFactory: createIpcFacadeMock,
        },
      ],
    }).compile();

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

    it('negative - should throw exception when IPC server is not running', async (done: DoneCallback) => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      await controller
        .spawn()
        .then(() => done.fail())
        .catch((exception: NoIpcOpenException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_NOT_OPEN);
          done();
        });
    });

    it('negative - should throw exception when python path is not defined', async (done: DoneCallback) => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new AssetPlayerPythonPathNotDefinedException();
      });

      await controller
        .spawn()
        .then(() => done.fail())
        .catch((exception: AssetPlayerPythonPathNotDefinedException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_PYTHON_PATH_NOT_DEFINED);
          done();
        });
    });

    it('negative - should throw exception when main.py path is not defined', async (done: DoneCallback) => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new AssetPlayerMainPathNotDefinedException();
      });

      await controller
        .spawn()
        .then(() => done.fail())
        .catch((exception: AssetPlayerMainPathNotDefinedException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_MAIN_PATH_NOT_DEFINED);
          done();
        });
    });

    it('negative - should throw exception when asset player already running', async (done: DoneCallback) => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new AssetPlayerAlreadyRunningException();
      });

      await controller
        .spawn()
        .then(() => done.fail())
        .catch((exception: AssetPlayerAlreadyRunningException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_PLAYER_ALREADY_RUNNING);
          done();
        });
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      mockIpcFacade.spawn.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .spawn()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('kill()', () => {
    it('positive - should kill running asset player program', async () => {
      const result: ResponseObject<void> = await controller.kill();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when asset player not running', async (done: DoneCallback) => {
      mockIpcFacade.kill.mockImplementationOnce(() => {
        throw new AssetPlayerNotRunningException();
      });

      await controller
        .kill()
        .then(() => done.fail())
        .catch((exception: AssetPlayerNotRunningException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_PLAYER_NOT_RUNNING);
          done();
        });
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      mockIpcFacade.kill.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .kill()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('open()', () => {
    it('positive - should start ipc server', async () => {
      const result: ResponseObject<void> = await controller.open();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already started', async (done: DoneCallback) => {
      mockIpcFacade.open.mockImplementationOnce(() => {
        throw new IpcAlreadyOpenException();
      });

      await controller
        .open()
        .then(() => done.fail())
        .catch((exception: IpcAlreadyOpenException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_ALREADY_OPEN);
          done();
        });
    });

    it('negative - should throw an exception when unexpected error occured', async (done: DoneCallback) => {
      mockIpcFacade.open.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .open()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('close()', () => {
    it('positive - should stop ipc server', async () => {
      const result: ResponseObject<void> = await controller.close();
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already stop', async (done: DoneCallback) => {
      mockIpcFacade.close.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      await controller
        .close()
        .then(() => done.fail())
        .catch((exception: NoIpcOpenException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_NOT_OPEN);
          done();
        });
    });

    it('negative - should throw an exception when unexpected error occured', async (done: DoneCallback) => {
      mockIpcFacade.close.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .close()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });
});
