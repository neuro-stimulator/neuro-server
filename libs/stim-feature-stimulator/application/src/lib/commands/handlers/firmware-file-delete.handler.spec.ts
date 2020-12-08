import { Test, TestingModule } from '@nestjs/testing';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FirmwareFileDeleteCommand } from '../impl/firmware-file-delete.command';
import { FirmwareFileDeleteHandler } from './firmware-file-delete.handler';

describe('FirmwareFileDeleteHandler', () => {
  let testingModule: TestingModule;
  let handler: FirmwareFileDeleteHandler;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FirmwareFileDeleteHandler,
        {
          provide: FileBrowserFacade,
          useFactory: jest.fn(() => ({ deleteFile: jest.fn() })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<FirmwareFileDeleteHandler>(FirmwareFileDeleteHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  it('positive - should call deleteFile', async () => {
    const path = 'path';
    const command = new FirmwareFileDeleteCommand(path);

    await handler.execute(command);

    expect(facade.deleteFile).toBeCalledWith(path);
  });
});
