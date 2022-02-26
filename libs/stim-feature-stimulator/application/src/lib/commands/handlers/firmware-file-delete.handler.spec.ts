import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { DeleteFileCommand } from '@neuro-server/stim-feature-file-browser/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FirmwareFileDeleteCommand } from '../impl/firmware-file-delete.command';

import { FirmwareFileDeleteHandler } from './firmware-file-delete.handler';

describe('FirmwareFileDeleteHandler', () => {
  let testingModule: TestingModule;
  let handler: FirmwareFileDeleteHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FirmwareFileDeleteHandler,
        commandBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<FirmwareFileDeleteHandler>(FirmwareFileDeleteHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should call deleteFile', async () => {
    const path = 'path';
    const command = new FirmwareFileDeleteCommand(path);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new DeleteFileCommand(path));
  });
});
