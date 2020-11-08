import * as SerialPort from 'serialport';
import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { PortIsAlreadyOpenException, PortIsNotOpenException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { MockType } from 'test-helpers/test-helpers';

import { SerialFacade } from '../service/serial.facade';
import { createSerialFacadeMock } from '../service/serial.facade.jest';
import { SerialController } from './serial.controller';

describe('SerialController', () => {
  let testingModule: TestingModule;
  let controller: SerialController;
  let mockSerialFacade: MockType<SerialFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [SerialController],
      providers: [
        {
          provide: SerialFacade,
          useFactory: createSerialFacadeMock,
        },
      ],
    }).compile();
    controller = testingModule.get(SerialController);
    // @ts-ignore
    mockSerialFacade = testingModule.get<MockType<SerialFacade>>(SerialFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('discover()', () => {
    it('positive - should return all available serial ports', async () => {
      const ports: SerialPort.PortInfo[] = [];

      mockSerialFacade.discover.mockReturnValue(ports);

      const result: ResponseObject<Record<string, unknown>[]> = await controller.discover();
      const expected: ResponseObject<SerialPort.PortInfo[]> = { data: ports };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when something gets wrong', async (done: DoneCallback) => {
      mockSerialFacade.discover.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .discover()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('open()', () => {
    it('positive - should open serial port', async () => {
      const params = { path: 'path' };

      const result: ResponseObject<any> = await controller.open(params);
      const expected: ResponseObject<any> = { message: { code: 0 } };

      expect(result).toEqual(expected);
    });

    it('negative - should not open already opened port', async (done: DoneCallback) => {
      const params = { path: 'path' };

      mockSerialFacade.open.mockImplementation(() => {
        throw new PortIsAlreadyOpenException();
      });

      await controller
        .open(params)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_ALREADY_OPEN);
          done();
        });
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      const params = { path: 'path' };

      mockSerialFacade.open.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .open(params)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('close()', () => {
    it('positive - should close serial port', async () => {
      const result: ResponseObject<any> = await controller.close();
      const expected: ResponseObject<any> = { message: { code: 0 } };

      expect(result).toEqual(expected);
    });

    it('negative - should not close port when none is opened', async (done: DoneCallback) => {
      mockSerialFacade.close.mockImplementation(() => {
        throw new PortIsNotOpenException();
      });

      await controller
        .close()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN);
          done();
        });
    });

    it('negative - should throw exception when unexpected error occured', async (done: DoneCallback) => {
      mockSerialFacade.close.mockImplementation(() => {
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

  describe('status()', () => {
    it('positive - should return stimulator connection status', async () => {
      const status = { connected: true };

      mockSerialFacade.status.mockReturnValue(status.connected);

      const result: ResponseObject<{ connected: boolean }> = await controller.status();
      const expected: ResponseObject<{ connected: boolean }> = { data: status };

      expect(result).toEqual(expected);
    });
  });
});
