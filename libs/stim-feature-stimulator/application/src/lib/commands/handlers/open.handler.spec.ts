import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Settings } from '@stechy1/diplomka-share';

import { PortIsAlreadyOpenException, PortIsUnableToOpenException } from '@neuro-server/stim-feature-stimulator/domain';

import { MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { OpenCommand } from '../impl/open.command';
import { OpenHandler } from './open.handler';

describe('OpenHandler', () => {
  const settings: Settings = { serial: { baudRate: 9600 } };

  let testingModule: TestingModule;
  let handler: OpenHandler;
  let service: MockType<SerialService>;
  let queryBus: MockType<QueryBus>

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        OpenHandler,
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
        queryBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<OpenHandler>(OpenHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SerialService>>(SerialService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    queryBus.execute.mockReturnValue(settings);
  });

  it('positive - should open serial port', async () => {
    const path = 'path';
    const command = new OpenCommand(path);

    await handler.execute(command);

    expect(service.open).toBeCalledWith(path, settings.serial);
  });

  it('negative - should throw exception when port is already open', () => {
    const path = 'path';
    const command = new OpenCommand(path);

    service.open.mockImplementationOnce(() => {
      throw new PortIsAlreadyOpenException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new PortIsAlreadyOpenException());
  });

  it('negative - should throw exception when port is not able to open', () => {
    const path = 'path';
    const command = new OpenCommand(path);

    service.open.mockImplementationOnce(() => {
      throw new PortIsUnableToOpenException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new PortIsUnableToOpenException());
  });
});
