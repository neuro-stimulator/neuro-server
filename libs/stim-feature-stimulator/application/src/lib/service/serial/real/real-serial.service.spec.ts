import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import {
  PortIsAlreadyOpenException,
  PortIsNotOpenException,
  PortIsUnableToCloseException,
  PortIsUnableToOpenException,
  SerialPort,
} from '@diplomka-backend/stim-feature-stimulator/domain';

import { SerialPortFactory } from '../../../factory/serial-port.factory';
import { createSerialPortFactoryMock, serialPortMock } from '../../../factory/serial-port.factory.jest';
import { RealSerialService } from './real-serial.service';
import { EventBus } from '@nestjs/cqrs';
import { SerialClosedEvent, SerialOpenEvent, StimulatorDataEvent } from '@diplomka-backend/stim-feature-stimulator/application';
import { MessageCodes } from '@stechy1/diplomka-share';

describe('RealSerialService', () => {
  let testingModule: TestingModule;
  let service: RealSerialService;
  let serial: MockType<SerialPort>;
  let factoryMock: MockType<SerialPortFactory>;
  let eventBusMock: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        RealSerialService,

        eventBusProvider,

        {
          provide: SerialPortFactory,
          useFactory: createSerialPortFactoryMock,
        },
      ],
    }).compile();

    service = testingModule.get<RealSerialService>(RealSerialService);
    // @ts-ignore
    factoryMock = testingModule.get<SerialPortFactory>(SerialPortFactory);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
    serial = serialPortMock;
  });

  afterEach(() => {
    eventBusMock.publish.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('discover()', () => {
    it('positive - should return all available ports', async () => {
      const available = [];

      factoryMock.list.mockReturnValueOnce(available);

      const result = await service.discover();

      expect(result).toEqual(available);
    });
  });

  describe('open()', () => {
    it('positive - should open serial port', async () => {
      const path = 'serial/path';
      const settings = undefined;

      await service.open(path, settings);

      expect(serial.pipe).toBeCalled();
      expect(serial.on).toBeCalledTimes(2);
      expect(serial.on.mock.calls[0]).toEqual(['data', expect.any(Function)]);
      expect(serial.on.mock.calls[1]).toEqual(['close', expect.any(Function)]);
      expect(service.isConnected).toBeTruthy();
      expect(eventBusMock.publish).toBeCalledWith(new SerialOpenEvent(path));
    });

    it('negative - should not open already opened port', async (done: DoneCallback) => {
      const path = 'serial/path';
      const settings = undefined;

      // Nejdříve port otevřu
      await service.open(path, settings);

      try {
        // Pak se ho pokusím otevřít znovu
        await service.open(path, settings);
        done.fail('PortIsAlreadyOpenException was not thrown!');
      } catch (e) {
        if (e instanceof PortIsAlreadyOpenException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_ALREADY_OPEN);
          expect(eventBusMock.publish).toHaveBeenCalledTimes(1);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when can not open the port', async (done: DoneCallback) => {
      const path = 'serial/path';
      const settings = undefined;

      factoryMock.createSerialPort.mockImplementationOnce((_, __, callback) => {
        callback(new Error());
        return serialPortMock;
      });

      try {
        await service.open(path, settings);
        done.fail('PortIsUnableToOpenException was not thrown!');
      } catch (e) {
        if (e instanceof PortIsUnableToOpenException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('close()', () => {
    it('positive - should close serial port', async () => {
      const path = 'serial/path';
      const settings = undefined;
      let closeCallback;

      // on('data', (data: Buffer))
      serial.on.mockImplementationOnce(() => null);
      // on('close', ())
      serial.on.mockImplementationOnce((event, callback) => {
        closeCallback = callback;
        return null;
      });

      // Nejdříve port otevřu
      await service.open(path, settings);
      expect(service.isConnected).toBeTruthy();

      serial.close.mockImplementationOnce((callback) => {
        closeCallback();
        callback(null);
        return null;
      });

      // Abych ho mohl následně zavřít
      await service.close();

      expect(service.isConnected).toBeFalsy();
      expect(eventBusMock.publish).toBeCalledWith(new SerialClosedEvent());
    });

    it('negative - should not close already closed port', async (done: DoneCallback) => {
      try {
        await service.close();
        done.fail('PortIsNotOpenException was not thrown!');
      } catch (e) {
        if (e instanceof PortIsNotOpenException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when can not close port', async (done: DoneCallback) => {
      const path = 'serial/path';
      const settings = undefined;

      // Nejdříve port otevřu
      await service.open(path, settings);

      serial.close.mockImplementationOnce((callback) => {
        callback(new Error());
        return null;
      });

      try {
        await service.close();
        done.fail('PortIsUnableToCloseException was not thrown!');
      } catch (e) {
        if (e instanceof PortIsUnableToCloseException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('write()', () => {
    it('positive - should write data to the serial port', async () => {
      const path = 'serial/path';
      const settings = undefined;
      const buffer: Buffer = Buffer.from([]);

      // Nejdříve port otevřu
      await service.open(path, settings);
      expect(service.isConnected).toBeTruthy();

      await service.write(buffer);

      expect(serial.write).toBeCalledWith(buffer);
    });

    it('negative - should not write data to closed serial port', async (done: DoneCallback) => {
      const buffer: Buffer = Buffer.from([]);

      try {
        await service.write(buffer);
        done.fail('PortIsNotOpenException was not thrown!');
      } catch (e) {
        if (e instanceof PortIsNotOpenException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('handleIncommingData()', () => {
    it('positive - should handle incomming data', async () => {
      const path = 'serial/path';
      const settings = undefined;
      const buffer: Buffer = Buffer.from([]);
      let dataCallback;

      serial.on.mockImplementationOnce((event, callback) => {
        dataCallback = callback;
        return null;
      });

      // Nejdříve port otevřu
      await service.open(path, settings);
      expect(service.isConnected).toBeTruthy();

      dataCallback(buffer);

      expect(eventBusMock.publish).toBeCalledWith(new StimulatorDataEvent(buffer));
    });
  });
});
