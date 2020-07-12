import { Test, TestingModule } from '@nestjs/testing';

import { GetStimulatorConnectionStatusQuery } from '@diplomka-backend/stim-feature-stimulator/application';

import { MockType } from 'test-helpers/test-helpers';

import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
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

    handler = testingModule.get<GetStimulatorConnectionStatusHandler>(GetStimulatorConnectionStatusHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SerialService>>(SerialService);
  });

  it('should return stimulator connection status', async () => {
    const connected = false;
    const query = new GetStimulatorConnectionStatusQuery();

    Object.defineProperty(service, 'isConnected', {
      get: jest.fn(() => connected),
    });

    const result = await handler.execute(query);

    expect(result).toBe(connected);
  });
});
