import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { PortIsNotOpenException, SerialPort } from '@diplomka-backend/stim-feature-stimulator/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SerialOpenEvent } from '../../../events/impl/serial-open.event';
import { createSerialPortFactoryMock, serialPortMock } from '../../../factory/serial-port.factory.jest';
import { SerialPortFactory } from '../../../factory/serial-port.factory';
import { FakeSerialService } from './fake-serial.service';
import { FakeSerialDataEmitter, FakeSerialDataHandler } from './fake-serial.data-handler';

describe('FakeSerialService', () => {
  let testingModule: TestingModule;
  let service: FakeSerialService;
  let serial: MockType<SerialPort>;
  let factoryMock: MockType<SerialPortFactory>;
  let eventBusMock: MockType<EventBus>;
  let fakeSerialDataHandlerMock: MockType<FakeSerialDataHandler>;
  let fakeSerialDataEmitter: FakeSerialDataEmitter;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FakeSerialService,

        eventBusProvider,

        {
          provide: SerialPortFactory,
          useFactory: createSerialPortFactoryMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<FakeSerialService>(FakeSerialService);
    // @ts-ignore
    factoryMock = testingModule.get<MockType<SerialPortFactory>>(SerialPortFactory);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
    serial = serialPortMock;
    fakeSerialDataHandlerMock = {
      handle: jest.fn(),
    };

    fakeSerialDataEmitter = service.registerFakeDataHandler(fakeSerialDataHandlerMock as FakeSerialDataHandler);
  });

  afterEach(() => {
    eventBusMock.publish.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('write()', () => {
    it('positive - should write data to fake data handler', async () => {
      const path = 'serial/path';
      const settings = undefined;
      const buffer: Buffer = Buffer.from([]);

      // Nejdříve port otevřu
      await service.open(path, settings);
      expect(service.isConnected).toBeTruthy();

      service.write(buffer);

      expect(fakeSerialDataHandlerMock.handle).toBeCalledWith(buffer);
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

      // Nejdříve port otevřu
      await service.open(path, settings);
      expect(service.isConnected).toBeTruthy();
      expect(eventBusMock.publish).toBeCalledWith(new SerialOpenEvent(path));

      fakeSerialDataEmitter.emit(buffer);

      expect(serial.write).toBeCalledWith(buffer);
    });
  });
});
