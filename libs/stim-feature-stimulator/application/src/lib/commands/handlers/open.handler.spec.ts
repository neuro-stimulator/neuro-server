import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { Settings } from '@stechy1/diplomka-share';

import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { PortIsAlreadyOpenException, PortIsUnableToOpenException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { OpenCommand } from '../impl/open.command';
import { OpenHandler } from './open.handler';

describe('OpenHandler', () => {
  let testingModule: TestingModule;
  let handler: OpenHandler;
  let service: MockType<SerialService>;
  let facade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        OpenHandler,
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
        {
          provide: SettingsFacade,
          useFactory: jest.fn(() => ({ getSettings: jest.fn() })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<OpenHandler>(OpenHandler);
    // @ts-ignore
    service = testingModule.get<MockType<SerialService>>(SerialService);
    // @ts-ignore
    facade = testingModule.get<MockType<SettingsFacade>>(SettingsFacade);
  });

  it('positive - should open serial port', async () => {
    const settings: Settings = { serial: { baudRate: 9600 } };
    const path = 'path';
    const command = new OpenCommand(path);

    facade.getSettings.mockReturnValueOnce(settings);

    await handler.execute(command);

    expect(service.open).toBeCalledWith(path, settings.serial);
  });

  it('negative - should throw exception when port is already open', async (done: DoneCallback) => {
    const settings: Settings = { serial: { baudRate: 9600 } };
    const path = 'path';
    const command = new OpenCommand(path);

    facade.getSettings.mockReturnValueOnce(settings);
    service.open.mockImplementationOnce(() => {
      throw new PortIsAlreadyOpenException();
    });

    try {
      await handler.execute(command);
      done.fail('PortIsAlreadyOpenException was not thrown!');
    } catch (e) {
      if (e instanceof PortIsAlreadyOpenException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when port is not able to open', async (done: DoneCallback) => {
    const settings: Settings = { serial: { baudRate: 9600 } };
    const path = 'path';
    const command = new OpenCommand(path);

    facade.getSettings.mockReturnValueOnce(settings);
    service.open.mockImplementationOnce(() => {
      throw new PortIsUnableToOpenException();
    });

    try {
      await handler.execute(command);
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
