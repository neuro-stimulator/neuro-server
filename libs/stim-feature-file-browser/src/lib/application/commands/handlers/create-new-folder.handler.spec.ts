import * as path from 'path';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { FileNotFoundException } from '../../../domain/exception/file-not-found.exception';
import { FileAlreadyExistsException } from '../../../domain/exception/file-already-exists.exception';
import { FolderWasCreatedEvent } from '../../events/impl/folder-was-created.event';
import { CreateNewFolderHandler } from './create-new-folder.handler';
import { CreateNewFolderCommand } from '../impl/create-new-folder.command';

describe('CreateNewContentHandler', () => {
  let testingModule: TestingModule;
  let handler: CreateNewFolderHandler;
  let service: MockType<FileBrowserService>;
  let eventBusMock: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        CreateNewFolderHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<CreateNewFolderHandler>(CreateNewFolderHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should create new public folder', async () => {
    const parentFolder = 'parent';
    const folderName = 'publicFolder';
    const publicPath = 'publicPath';
    const parentPath = path.join(publicPath, parentFolder);
    const command = new CreateNewFolderCommand(`${parentFolder}/${folderName}`, 'public', false);

    service.mergePublicPath.mockReturnValueOnce(parentPath);
    service.mergePublicPath.mockReturnValueOnce(path.join(parentPath, folderName));
    service.existsFile.mockReturnValue(false);

    const [parent, createdFolderName] = await handler.execute(command);

    expect(parent).toEqual(parentFolder);
    expect(createdFolderName).toEqual(folderName);
    expect(eventBusMock.publish).toBeCalledWith(new FolderWasCreatedEvent(path.join(parentPath, folderName)));
  });

  it('positive - should create new private folder', async () => {
    const parentFolder = 'parent';
    const folderName = 'privateFolder';
    const privatePath = 'privatePath';
    const parentPath = path.join(privatePath, parentFolder);
    const command = new CreateNewFolderCommand(`${parentFolder}/${folderName}`, 'private', false);

    service.mergePrivatePath.mockReturnValueOnce(parentPath);
    service.mergePrivatePath.mockReturnValueOnce(path.join(parentPath, folderName));
    service.existsFile.mockReturnValue(false);

    const [parent, createdFolderName] = await handler.execute(command);

    expect(parent).toEqual(parentFolder);
    expect(createdFolderName).toEqual(folderName);
    expect(eventBusMock.publish).toBeCalledWith(new FolderWasCreatedEvent(path.join(parentPath, folderName)));
  });

  it('positive - should not create existing folder', async () => {
    const parentFolder = 'parent';
    const folderName = 'privateFolder';
    const privatePath = 'privatePath';
    const parentPath = path.join(privatePath, parentFolder);
    const command = new CreateNewFolderCommand(`${parentFolder}/${folderName}`, 'private', false);

    service.mergePrivatePath.mockReturnValueOnce(parentPath);
    service.mergePrivatePath.mockReturnValueOnce(path.join(parentPath, folderName));
    service.existsFile.mockReturnValue(true);

    const [parent, createdFolderName] = await handler.execute(command);

    expect(parent).toEqual(parentFolder);
    expect(createdFolderName).toEqual(folderName);
    expect(eventBusMock.publish).not.toBeCalled();
  });

  it('negative - should throw exception when path to parent folder does not exists', () => {
    const parentFolder = 'parent';
    const folderName = 'privateFolder';
    const privatePath = 'privatePath';
    const command = new CreateNewFolderCommand(`${parentFolder}/${folderName}`, 'private', false);

    service.mergePrivatePath.mockImplementationOnce(() => {
      throw new FileNotFoundException(command.location);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new FileNotFoundException(command.location));
  });

  it('negative - should throw exception when folder exists', () => {
    const parentFolder = 'parent';
    const folderName = 'privateFolder';
    const privatePath = 'privatePath';
    const parentPath = path.join(privatePath, parentFolder);
    const command = new CreateNewFolderCommand(`${parentFolder}/${folderName}`, 'private', true);

    service.mergePrivatePath.mockReturnValueOnce(parentPath);
    service.mergePrivatePath.mockReturnValueOnce(path.join(parentPath, folderName));
    service.existsFile.mockReturnValue(true);

    expect(() => handler.execute(command)).rejects.toThrow(new FileAlreadyExistsException(path.join(parentPath, folderName)));
  });
});
