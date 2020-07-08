import * as path from 'path';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { FileWasDeletedEvent } from '../../events/impl/file-was-deleted.event';
import { DeleteFileHandler } from './delete-file.handler';
import { DeleteFileCommand } from '../impl/delete-file.command';
import { FileNotFoundException } from '@diplomka-backend/stim-feature-file-browser';

describe('DeleteFileHandler', () => {
  let testingModule: TestingModule;
  let handler: DeleteFileHandler;
  let service: MockType<FileBrowserService>;
  let eventBusMock: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        DeleteFileHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<DeleteFileHandler>(DeleteFileHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should delete public folder', async () => {
    const parentFolder = 'parent';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const rootParentPath = path.join(publicPath, parentFolder);
    const rootFolderPath = path.join(rootParentPath, folderName);
    const command = new DeleteFileCommand(`${parentFolder}/${folderName}`, 'public');

    service.mergePublicPath.mockReturnValueOnce(rootFolderPath);

    const parentFolderResult = await handler.execute(command);

    expect(parentFolderResult).toEqual(parentFolder);
    expect(eventBusMock.publish).toBeCalledWith(new FileWasDeletedEvent(`${parentFolder}/${folderName}`));
  });

  it('positive - should delete private folder', async () => {
    const parentFolder = 'parent';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const rootParentPath = path.join(publicPath, parentFolder);
    const rootFolderPath = path.join(rootParentPath, folderName);
    const command = new DeleteFileCommand(`${parentFolder}/${folderName}`, 'private');

    service.mergePublicPath.mockReturnValueOnce(rootFolderPath);

    const parentFolderResult = await handler.execute(command);

    expect(parentFolderResult).toEqual(parentFolder);
    expect(eventBusMock.publish).toBeCalledWith(new FileWasDeletedEvent(`${parentFolder}/${folderName}`));
  });

  it('negative - should throw exception when invalid absolute path', async (done: DoneCallback) => {
    const parentFolder = 'parent-invalid';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const rootParentPath = path.join(publicPath, parentFolder);
    const rootFolderPath = path.join(rootParentPath, folderName);
    const command = new DeleteFileCommand(`${parentFolder}/${folderName}`, 'public');

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(rootFolderPath);
    });

    try {
      await handler.execute(command);
      done.fail('FileNotFoundException was not thrown!');
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        expect(e.path).toEqual(rootFolderPath);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
