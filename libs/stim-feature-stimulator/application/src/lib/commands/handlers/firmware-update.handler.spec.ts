import { CommandBus, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { FirmwareUpdateFailedException } from '@neuro-server/stim-feature-stimulator/domain';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FirmwareUpdatedEvent } from '../../events/impl/firmware-updated.event';
import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { FirmwareUpdateCommand } from '../impl/firmware-update.command';

import { FirmwareUpdateHandler } from './firmware-update.handler';

describe('FirmwareUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: FirmwareUpdateHandler;
  let service: MockType<StimulatorService>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FirmwareUpdateHandler,
        {
          provide: StimulatorService,
          useFactory: createStimulatorServiceMock,
        },
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<FirmwareUpdateHandler>(FirmwareUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  it('positive - should update stimulator firmware', async () => {
    const firmwarePath = 'path';
    const mergedPath = 'merged/path';
    const command = new FirmwareUpdateCommand(firmwarePath);

    commandBus.execute.mockReturnValueOnce(mergedPath);

    await handler.execute(command);

    expect(service.updateFirmware).toBeCalledWith(mergedPath);
    expect(eventBus.publish).toBeCalledWith(new FirmwareUpdatedEvent(firmwarePath));
  });

  it('negative - should throw exception when firmware update fail',  () => {
    const firmwarePath = 'path';
    const mergedPath = 'merged/path';
    const command = new FirmwareUpdateCommand(firmwarePath);

    commandBus.execute.mockReturnValueOnce(mergedPath);
    service.updateFirmware.mockImplementationOnce(() => {
      throw new FirmwareUpdateFailedException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new FirmwareUpdateFailedException());
  });
});
