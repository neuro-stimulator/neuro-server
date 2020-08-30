import { Test, TestingModule } from '@nestjs/testing';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';
import { FirmwareFileDeleteCommand } from '@diplomka-backend/stim-feature-stimulator/application';

import { MockType } from 'test-helpers/test-helpers';

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
