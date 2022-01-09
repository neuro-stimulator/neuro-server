import * as path from 'path';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { FileNotFoundException, UploadedFileStructure } from '@neuro-server/stim-feature-file-browser/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../service/file-browser.service';
import { createFileBrowserServiceMock } from '../../service/file-browser.service.jest';
import { FileWasUploadedEvent } from '../../events/impl/file-was-uploaded.event';
import { UploadFilesCommand } from '../impl/upload-files.command';
import { UploadFilesHandler } from './upload-files.handler';

describe('UploadFilesHandler', () => {
  let testingModule: TestingModule;
  let handler: UploadFilesHandler;
  let service: MockType<FileBrowserService>;
  let eventBusMock: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        UploadFilesHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<UploadFilesHandler>(UploadFilesHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should save uploaded files to public folder', async () => {
    const uploadedFileStructure: UploadedFileStructure = {
      fieldname: 'fieldname',
      originalname: 'originalname',
      encoding: 'encoding',
      mimetype: 'mimetype',
      buffer: null,
      size: 256,
      path: 'newFolder',
      filename: 'newFolder',
      destination: '',
      stream: null
    };
    const parentFolder = 'parent';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const rootParentPath = path.join(publicPath, parentFolder);
    const rootFolderPath = path.join(rootParentPath, folderName);
    const fileDestinationPath = path.join(rootFolderPath, uploadedFileStructure.originalname);
    const command = new UploadFilesCommand([uploadedFileStructure], `${parentFolder}/${folderName}`);

    service.mergePublicPath.mockReturnValueOnce(rootFolderPath);
    service.mergePublicPath.mockReturnValueOnce(fileDestinationPath);

    await handler.execute(command);

    expect(service.writeFileContent).toBeCalledWith(fileDestinationPath, uploadedFileStructure.buffer);
    expect(eventBusMock.publish).toBeCalledWith(new FileWasUploadedEvent(fileDestinationPath));
  });

  it('negative - should throw exception when destination path not found', () => {
    const uploadedFileStructure: UploadedFileStructure = {
      fieldname: 'fieldname',
      originalname: 'originalname',
      encoding: 'encoding',
      mimetype: 'mimetype',
      buffer: null,
      size: 256,
      path: 'newFolder',
      filename: 'newFolder',
      destination: '',
      stream: null
    };
    const parentFolder = 'parent';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const rootParentPath = path.join(publicPath, parentFolder);
    const rootFolderPath = path.join(rootParentPath, folderName);
    const command = new UploadFilesCommand([uploadedFileStructure], `${parentFolder}/${folderName}`);

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(rootFolderPath);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new FileNotFoundException(rootFolderPath))
  });
});
