import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';
import { FirmwareUpdateCommand, FirmwareUpdatedEvent } from '@diplomka-backend/stim-feature-stimulator/application';
import { FirmwareUpdateFailedException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { FirmwareUpdateHandler } from './firmware-update.handler';

describe('FirmwareUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: FirmwareUpdateHandler;
  let service: MockType<StimulatorService>;
  let facade: MockType<FileBrowserFacade>;
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
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({ mergePublicPath: jest.fn() })),
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<FirmwareUpdateHandler>(FirmwareUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  it('positive - should update stimulator firmware', async () => {
    const firmwarePath = 'path';
    const mergedPath = 'merged/path';
    const command = new FirmwareUpdateCommand(firmwarePath);

    facade.mergePublicPath.mockReturnValueOnce(mergedPath);

    await handler.execute(command);

    expect(service.updateFirmware).toBeCalledWith(mergedPath);
    expect(eventBus.publish).toBeCalledWith(new FirmwareUpdatedEvent(firmwarePath));
  });

  it('negative - should throw exception when firmware update fail', async (done: DoneCallback) => {
    const firmwarePath = 'path';
    const mergedPath = 'merged/path';
    const command = new FirmwareUpdateCommand(firmwarePath);

    facade.mergePublicPath.mockReturnValueOnce(mergedPath);
    service.updateFirmware.mockImplementationOnce(() => {
      throw new FirmwareUpdateFailedException();
    });

    try {
      await handler.execute(command);
      done.fail('FirmwareUpdateFailedException was not thrown!');
    } catch (e) {
      if (e instanceof FirmwareUpdateFailedException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
