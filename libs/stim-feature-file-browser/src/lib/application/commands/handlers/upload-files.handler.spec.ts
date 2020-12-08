import * as path from 'path';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileNotFoundException } from '../../../domain/exception/file-not-found.exception';
import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { UploadedFileStructure } from '../../../domain/model/uploaded-file-structure';
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
      size: '',
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

  it('negative - should throw exception when destination path not found', async (done: DoneCallback) => {
    const uploadedFileStructure: UploadedFileStructure = {
      fieldname: 'fieldname',
      originalname: 'originalname',
      encoding: 'encoding',
      mimetype: 'mimetype',
      buffer: null,
      size: '',
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

    try {
      await handler.execute(command);
      done.fail('FileNotFoundException was not thrown!');
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        expect(e.path).toEqual(rootFolderPath);
        expect(eventBusMock.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
