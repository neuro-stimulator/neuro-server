import { Test, TestingModule } from '@nestjs/testing';
import * as SerialPort from 'serialport';

import { ConnectionStatus, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import {
  PortIsAlreadyOpenException,
  PortIsNotOpenException,
  PortIsUnableToOpenException
} from '@neuro-server/stim-feature-stimulator/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
    testingModule.useLogger(new NoOpLogger());
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

    it('negative - should throw exception when something gets wrong', () => {
      mockSerialFacade.discover.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.discover()).rejects.toThrow(new ControllerException());
    });
  });

  describe('open()', () => {
    it('positive - should open serial port', async () => {
      const params = { path: 'path' };

      const result: ResponseObject<any> = await controller.open(params);
      const expected: ResponseObject<any> = { message: { code: 0 } };

      expect(result).toEqual(expected);
    });

    it('negative - should not open already opened port', () => {
      const params = { path: 'path' };

      mockSerialFacade.open.mockImplementation(() => {
        throw new PortIsAlreadyOpenException();
      });

      expect(() => controller.open(params)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_ALREADY_OPEN));
    });

    it('negative - should not open already opened port', () => {
      const params = { path: 'path' };

      mockSerialFacade.open.mockImplementation(() => {
        throw new PortIsUnableToOpenException();
      });

      expect(() => controller.open(params)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_UNABLE_TO_OPEN));
    });

    it('negative - should throw exception when unexpected error occured', () => {
      const params = { path: 'path' };

      mockSerialFacade.open.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.open(params)).rejects.toThrow(new ControllerException());
    });
  });

  describe('close()', () => {
    it('positive - should close serial port', async () => {
      const result: ResponseObject<any> = await controller.close();
      const expected: ResponseObject<any> = { message: { code: 0 } };

      expect(result).toEqual(expected);
    });

    it('negative - should not close port when none is opened', () => {
      mockSerialFacade.close.mockImplementation(() => {
        throw new PortIsNotOpenException();
      });

      expect(() => controller.close()).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN));
    });

    it('negative - should throw exception when unexpected error occured',  () => {
      mockSerialFacade.close.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.close()).rejects.toThrow(new ControllerException());
    });
  });

  describe('status()', () => {
    it('positive - should return stimulator connection status', async () => {
      const status = { status: ConnectionStatus.CONNECTED };

      mockSerialFacade.status.mockReturnValue(status.status);

      const result: ResponseObject<{ status: ConnectionStatus }> = await controller.status();
      const expected: ResponseObject<{ status: ConnectionStatus }> = { data: status };

      expect(result).toEqual(expected);
    });
  });
});
