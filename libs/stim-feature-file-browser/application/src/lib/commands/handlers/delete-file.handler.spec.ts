import * as path from 'path';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../service/file-browser.service';
import { createFileBrowserServiceMock } from '../../service/file-browser.service.jest';
import { FileWasDeletedEvent } from '../../events/impl/file-was-deleted.event';
import { DeleteFileHandler } from './delete-file.handler';
import { DeleteFileCommand } from '../impl/delete-file.command';

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
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw exception when invalid absolute path', () => {
    const parentFolder = 'parent-invalid';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const rootParentPath = path.join(publicPath, parentFolder);
    const rootFolderPath = path.join(rootParentPath, folderName);
    const command = new DeleteFileCommand(`${parentFolder}/${folderName}`, 'public');

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(rootFolderPath);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new FileNotFoundException(rootFolderPath));
  });
});
