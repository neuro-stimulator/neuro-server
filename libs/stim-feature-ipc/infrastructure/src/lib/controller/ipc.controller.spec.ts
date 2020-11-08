import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { IpcFacade } from '@diplomka-backend/stim-feature-ipc/infrastructure';

import { MockType } from 'test-helpers/test-helpers';

import { createIpcFacadeMock } from '../service/ipc.facade.jest';
import { IpcController } from './ipc.controller';
import { IpcAlreadyConnectedException, NoIpcOpenException } from '@diplomka-backend/stim-feature-ipc/domain';
import { ControllerException } from '@diplomka-backend/stim-lib-common';

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
      const connected = false;

      mockIpcFacade.isConnected.mockReturnValue(connected);

      const result: ResponseObject<{ connected: boolean }> = await controller.status();
      const expected: ResponseObject<{ connected: boolean }> = { data: { connected } };

      expect(result).toEqual(expected);
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
        throw new IpcAlreadyConnectedException();
      });

      await controller
        .open()
        .then(() => done.fail())
        .catch((exception: IpcAlreadyConnectedException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_ALREADY_CONNECTED);
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

  describe('setOutputSynchronization()', () => {
    it('positive - should stop ipc server', async () => {
      const synchronize = false;
      const result: ResponseObject<void> = await controller.setOutputSynchronization(synchronize);
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already stop', async (done: DoneCallback) => {
      const synchronize = false;

      mockIpcFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      await controller
        .setOutputSynchronization(synchronize)
        .then(() => done.fail())
        .catch((exception: NoIpcOpenException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_NOT_OPEN);
          done();
        });
    });

    it('negative - should throw an exception when unexpected error occured', async (done: DoneCallback) => {
      const synchronize = false;

      mockIpcFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .setOutputSynchronization(synchronize)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });
});
