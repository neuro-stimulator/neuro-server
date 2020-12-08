import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createSerialServiceMock } from '../../service/serial.service.jest';
import { SerialService } from '../../service/serial.service';
import { DiscoverQuery } from '../impl/discover.query';
import { DiscoverHandler } from './discover.handler';

describe('DiscoverHandler', () => {
  let testingModule: TestingModule;
  let handler: DiscoverHandler;
  let service: MockType<SerialService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        DiscoverHandler,
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<DiscoverHandler>(DiscoverHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SerialService>>(SerialService);
  });

  it('positive - should discover available serial ports', async () => {
    const devices = [];
    const query = new DiscoverQuery();

    service.discover.mockReturnValue(devices);

    const result = await handler.execute(query);

    expect(result).toEqual(devices);
  });
});
