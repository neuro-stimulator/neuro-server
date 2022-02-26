import { Test, TestingModule } from '@nestjs/testing';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { GetStimulatorConnectionStatusQuery } from '../impl/get-stimulator-connection-status.query';

import { GetStimulatorConnectionStatusHandler } from './get-stimulator-connection-status.handler';

describe('GetStimulatorConnectionStatusHandler', () => {
  let testingModule: TestingModule;
  let handler: GetStimulatorConnectionStatusHandler;
  let service: MockType<SerialService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetStimulatorConnectionStatusHandler,
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<GetStimulatorConnectionStatusHandler>(GetStimulatorConnectionStatusHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SerialService>>(SerialService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return stimulator connection status', async () => {
    const connected = true;
    const query = new GetStimulatorConnectionStatusQuery();

    Object.defineProperty(service, 'isConnected', {
      get: jest.fn(() => connected),
    });

    const result = await handler.execute(query);

    expect(result).toBe(ConnectionStatus.CONNECTED);
  });

  it('should return stimulator connection status', async () => {
    const connected = false;
    const query = new GetStimulatorConnectionStatusQuery();

    Object.defineProperty(service, 'isConnected', {
      get: jest.fn(() => connected),
    });

    const result = await handler.execute(query);

    expect(result).toBe(ConnectionStatus.DISCONNECTED);
  });
});
