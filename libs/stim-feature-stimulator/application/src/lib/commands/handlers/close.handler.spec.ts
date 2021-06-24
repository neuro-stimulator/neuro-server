import { Test, TestingModule } from '@nestjs/testing';

import { PortIsNotOpenException, PortIsUnableToCloseException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { CloseCommand } from '../impl/close.command';
import { CloseHandler } from './close.handler';

describe('CloseHandler', () => {
  let testingModule: TestingModule;
  let handler: CloseHandler;
  let service: MockType<SerialService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        CloseHandler,
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<CloseHandler>(CloseHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SerialService>>(SerialService);
  });

  it('positive - should close serial port', async () => {
    const command = new CloseCommand();

    await handler.execute(command);

    expect(service.close).toBeCalled();
  });

  it('negative - should throw exception when no port is open', () => {
    const command = new CloseCommand();

    service.close.mockImplementationOnce(() => {
      throw new PortIsNotOpenException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new PortIsNotOpenException());
  });

  it('negative - should throw exception when port is not possible to close', () => {
    const command = new CloseCommand();

    service.close.mockImplementationOnce(() => {
      throw new PortIsUnableToCloseException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new PortIsUnableToCloseException());
  });
});
