import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import {
  GetContentQuery,
  ReadPrivateJSONFileQuery,
  MergePublicPathQuery,
  MergePrivatePathQuery,
  CreateNewFolderCommand,
  DeleteFileCommand,
  UploadFilesCommand,
  WritePrivateJSONFileCommand
} from '@neuro-server/stim-feature-file-browser/application';
import { UploadedFileStructure } from '@neuro-server/stim-feature-file-browser/domain';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { FileBrowserFacade } from './file-browser.facade';

describe('FileBrowserFacade', () => {
  let testingModule: TestingModule;
  let commandBusMock: MockType<CommandBus>;
  let queryBusMock: MockType<QueryBus>;
  let facade: FileBrowserFacade;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [FileBrowserFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    // @ts-ignore
    commandBusMock = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBusMock = testingModule.get<MockType<QueryBus>>(QueryBus);
    facade = testingModule.get<FileBrowserFacade>(FileBrowserFacade);
  });

  afterEach(() => {
    commandBusMock.execute.mockClear();
    queryBusMock.execute.mockClear();
  });

  describe('getContent()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';

      await facade.getContent(filePath);

      expect(queryBusMock.execute).toBeCalledWith(new GetContentQuery(filePath));
    });
  });

  describe('readPrivateJSONFile()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';

      await facade.readPrivateJSONFile(filePath);

      expect(queryBusMock.execute).toBeCalledWith(new ReadPrivateJSONFileQuery(filePath));
    });
  });

  describe('createNewFolder()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';

      await facade.createNewFolder(filePath);

      expect(commandBusMock.execute).toBeCalledWith(new CreateNewFolderCommand(filePath));
    });
  });

  describe('uploadFiles()', () => {
    it('positive - should call', async () => {
      const files: UploadedFileStructure[] = [];
      const filePath = 'file/path';

      await facade.uploadFiles(files, filePath);

      expect(commandBusMock.execute).toBeCalledWith(new UploadFilesCommand(files, filePath));
    });
  });

  describe('deleteFile()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';

      await facade.deleteFile(filePath);

      expect(commandBusMock.execute).toBeCalledWith(new DeleteFileCommand(filePath));
    });
  });

  describe('mergePublicPath()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';

      await facade.mergePublicPath(filePath);

      expect(queryBusMock.execute).toBeCalledWith(new MergePublicPathQuery(filePath));
    });
  });

  describe('mergePrivatePath()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';

      await facade.mergePrivatePath(filePath);

      expect(queryBusMock.execute).toBeCalledWith(new MergePrivatePathQuery(filePath));
    });
  });

  describe('writePrivateJSONFile()', () => {
    it('positive - should call', async () => {
      const filePath = 'file/path';
      const content = '';

      await facade.writePrivateJSONFile(filePath, content);

      expect(commandBusMock.execute).toBeCalledWith(new WritePrivateJSONFileCommand(filePath, content));
    });
  });
});
