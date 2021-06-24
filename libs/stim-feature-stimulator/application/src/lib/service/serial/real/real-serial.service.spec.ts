import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import {
  PortIsAlreadyOpenException,
  PortIsNotOpenException,
  PortIsUnableToCloseException,
  PortIsUnableToOpenException,
  SerialPort,
} from '@diplomka-backend/stim-feature-stimulator/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SerialOpenEvent } from '../../../events/impl/serial-open.event';
import { SerialClosedEvent } from '../../../events/impl/serial-closed.event';
import { StimulatorDataEvent } from '../../../events/impl/stimulator-data.event';
import { SerialPortFactory } from '../../../factory/serial-port.factory';
import { createSerialPortFactoryMock, serialPortMock } from '../../../factory/serial-port.factory.jest';
import { RealSerialService } from './real-serial.service';

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
    testingModule.useLogger(new NoOpLogger());

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

    it('negative - should not open already opened port', async () => {
      const path = 'serial/path';
      const settings = undefined;

      // Nejdříve port otevřu
      await service.open(path, settings);

      await expect(() => service.open(path, settings)).rejects.toThrow(new PortIsAlreadyOpenException());
      expect(eventBusMock.publish).toHaveBeenCalledTimes(1);
    });

    it('negative - should throw exception when can not open the port', () => {
      const path = 'serial/path';
      const settings = undefined;

      factoryMock.createSerialPort.mockImplementationOnce((_, __, callback) => {
        callback(new Error());
        return serialPortMock;
      });

      expect(() => service.open(path, settings)).rejects.toThrow(new PortIsUnableToOpenException());
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

    it('negative - should not close already closed port', () => {
      expect(() => service.close()).rejects.toThrow(new PortIsNotOpenException());
    });

    it('negative - should throw exception when can not close port', async () => {
      const path = 'serial/path';
      const settings = undefined;

      // Nejdříve port otevřu
      await service.open(path, settings);

      serial.close.mockImplementationOnce((callback) => {
        callback(new Error());
        return null;
      });

      expect(() => service.close()).rejects.toThrow(new PortIsUnableToCloseException());
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

      service.write(buffer);

      expect(serial.write).toBeCalledWith(buffer);
    });

    it('negative - should not write data to closed serial port', () => {
      const buffer: Buffer = Buffer.from([]);

      expect(() => service.write(buffer)).toThrow(new PortIsNotOpenException());
    });
  });

  describe('handleIncommingData()', () => {
    it('positive - should handle incomming data', async () => {
      const path = 'serial/path';
      const settings = undefined;
      const buffer: Buffer = Buffer.from([]);
      let dataCallback = (b: Buffer) => {};

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
