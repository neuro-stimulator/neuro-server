import DoneCallback = jest.DoneCallback;
import { Test, TestingModule } from '@nestjs/testing';

import { fakeFileStats, NoOpLogger } from 'test-helpers/test-helpers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
jest.mock('fs', require('test-helpers/test-helpers').fsMockFactory);
import * as fs from 'fs';
import * as path from 'path';

import { FileRecord, MessageCodes } from '@stechy1/diplomka-share';

import { FileBrowserModuleConfig, FILE_BROWSER_MODULE_CONFIG_CONSTANT } from '../config';
import { FileAccessRestrictedException } from '../exception/file-access-restricted.exception';
import { FileNotFoundException } from '../exception/file-not-found.exception';
import { FolderIsUnableToCreateException } from '../exception/folder-is-unable-to-create.exception';
import { FileBrowserService } from './file-browser.service';

describe('FileBrowserService', () => {
  const basePath = 'basePath';
  const privateSpace = 'private';
  const publicSpace = 'public';
  const config: FileBrowserModuleConfig = {
    appDataRoot: basePath
  };

  let testingModule: TestingModule;
  let service: FileBrowserService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FileBrowserService,
        {
          provide: FILE_BROWSER_MODULE_CONFIG_CONSTANT,
          useValue: config,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<FileBrowserService>(FileBrowserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', async () => {
    expect(service).toBeDefined();

    expect(fs.promises.mkdir as jest.Mock).toBeCalledTimes(3);

    expect((fs.promises.mkdir as jest.Mock).mock.calls[0]).toEqual([basePath]);
    expect((fs.promises.mkdir as jest.Mock).mock.calls[1]).toEqual([path.join(basePath, privateSpace)]);
    expect((fs.promises.mkdir as jest.Mock).mock.calls[2]).toEqual([path.join(basePath, publicSpace)]);
  });

  describe('mergePath()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should merge path parts into one path', async () => {
      const parts = ['part1', 'part2'];
      const expected = path.join(...parts);

      expect(service.mergePath(...parts)).toEqual(expected);
    });
  });

  describe('mergePublicPath()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should merge path parts with public path into one path', async () => {
      const parts = ['part1', 'part2'];
      const expected = path.join(basePath, publicSpace, ...parts);

      expect(service.mergePublicPath(false, ...parts)).toEqual(expected);
    });

    it('negative - should throw exception when public path is not secured', (done: DoneCallback) => {
      const parts = ['..', '..', 'part1', 'part2'];

      try {
        service.mergePublicPath(false, ...parts);
        done.fail('FileAccessRestrictedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(FileAccessRestrictedException);
        expect((e as FileAccessRestrictedException).restrictedPath).toEqual(path.join(basePath, publicSpace, ...parts));
        expect((e as FileAccessRestrictedException).errorCode).toEqual(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED);
        done();
      }
    });

    it('negative - should not throw exception when file not found', (done: DoneCallback) => {
      const parts = ['part1', 'part2'];
      const pathExists = false;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);

      try {
        service.mergePublicPath(false, ...parts);
        done();
      } catch (e) {
        done.fail('Unexpected excaption was thrown!');
      }
    });

    it('negative - should throw exception when file not found', (done: DoneCallback) => {
      const parts = ['part1', 'part2'];
      const pathExists = false;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);

      try {
        service.mergePublicPath(true, ...parts);
        done.fail('FileNotFoundException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(FileNotFoundException);
        expect((e as FileNotFoundException).path).toEqual(path.join(basePath, publicSpace, ...parts));
        expect((e as FileNotFoundException).errorCode).toEqual(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
        done();
      }
    });
  });

  describe('mergePrivatePath()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should merge path parts with private path into one path', async () => {
      const parts = ['part1', 'part2'];
      const expected = path.join(basePath, privateSpace, ...parts);

      expect(service.mergePrivatePath(false, ...parts)).toEqual(expected);
    });

    it('negative - should throw exception when private path is not secured', (done: DoneCallback) => {
      const parts = ['..', '..', 'part1', 'part2'];

      try {
        service.mergePrivatePath(false, ...parts);
        done.fail('FileAccessRestrictedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(FileAccessRestrictedException);
        expect((e as FileAccessRestrictedException).restrictedPath).toEqual(path.join(basePath, privateSpace, ...parts));
        expect((e as FileAccessRestrictedException).errorCode).toEqual(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED);
        done();
      }
    });

    it('negative - should not throw exception when file not found', (done: DoneCallback) => {
      const parts = ['part1', 'part2'];
      const pathExists = false;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);

      try {
        service.mergePrivatePath(false, ...parts);
        done();
      } catch (e) {
        done.fail('Unexpected excaption was thrown!');
      }
    });

    it('negative - should throw exception when file not found', (done: DoneCallback) => {
      const parts = ['part1', 'part2'];
      const pathExists = false;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);

      try {
        service.mergePrivatePath(true, ...parts);
        done.fail('FileNotFoundException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(FileNotFoundException);
        expect((e as FileNotFoundException).path).toEqual(path.join(basePath, privateSpace, ...parts));
        expect((e as FileNotFoundException).errorCode).toEqual(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
        done();
      }
    });
  });

  describe('isPublicPathSecured()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - public path should be secured', async () => {
      const parts = [basePath, publicSpace, 'part1', 'part2'];

      expect(service.isPublicPathSecured(path.join(...parts))).toBeTruthy();
    });

    it('negative - public path should be secured', async () => {
      const parts = [publicSpace, 'part1', 'part2'];

      expect(service.isPublicPathSecured(path.join(...parts))).toBeFalsy();
    });

    it('negative - public path should be secured', async () => {
      const parts = ['part1', 'part2'];

      expect(service.isPublicPathSecured(path.join(...parts))).toBeFalsy();
    });
  });

  describe('isPrivatePathSecured()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - private path should be secured', async () => {
      const parts = [basePath, privateSpace, 'part1', 'part2'];

      expect(service.isPrivatePathSecured(path.join(...parts))).toBeTruthy();
    });

    it('negative - private path should be secured', async () => {
      const parts = [privateSpace, 'part1', 'part2'];

      expect(service.isPrivatePathSecured(path.join(...parts))).toBeFalsy();
    });

    it('negative - private path should be secured', async () => {
      const parts = ['part1', 'part2'];

      expect(service.isPrivatePathSecured(path.join(...parts))).toBeFalsy();
    });
  });

  describe('recursiveDelete()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should ', async () => {});
  });

  describe('moveFiles()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should ', async () => {});
  });

  describe('getFilesFromDirectory()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should return fileRecord', async () => {
      const fileName = 'file.txt';
      const files = [fileName];
      const parentDirectory = 'directory';
      const isDirectory = false;
      const stats = fakeFileStats();

      (fs.readdirSync as jest.Mock).mockReturnValueOnce(files);
      (fs.statSync as jest.Mock).mockReturnValueOnce(stats);

      stats.isDirectory.mockReturnValueOnce(isDirectory);

      const fileRecords: FileRecord[] = await service.getFilesFromDirectory(parentDirectory, 'public');

      expect(fileRecords).toHaveLength(files.length);
      expect(fileRecords[0]).toEqual(
        expect.objectContaining({
          name: fileName,
          path: path.join(parentDirectory, fileName).replace(/\\/g, '/'),
          isDirectory,
          isImage: isDirectory,
          width: undefined,
          height: undefined,
          extention: fileName.substring(fileName.indexOf('.') + 1),
          hash: '', // this.hashFile(fullPath),
          selected: false,
        })
      );
    });

    it('positive - should return empty collection', async () => {
      const files = [];
      const parentDirectory = 'directory';
      class FileError extends Error {
        constructor(public readonly errno: number) {
          super();
        }
      }

      (fs.readdirSync as jest.Mock).mockImplementationOnce(() => {
        throw new FileError(-2);
      });

      const fileRecords: FileRecord[] = await service.getFilesFromDirectory(parentDirectory, 'public');

      expect(fileRecords).toHaveLength(files.length);
    });
  });

  describe('createDirectory()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should create new directory', async () => {
      const name = 'new_directory';
      const pathExists = false;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);

      const result: boolean = await service.createDirectory(name);

      expect(result).toBeTruthy();
      expect(fs.promises.mkdir).toBeCalledWith(name);
    });

    it('negative - should return false when directory already exists', async () => {
      const name = 'new_directory';
      const pathExists = true;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);

      const result: boolean = await service.createDirectory(name);

      expect(result).toBeFalsy();
    });

    it('negative - should return false when can not create new directory and exception is disabled', async () => {
      const name = 'new_directory';
      const pathExists = false;
      const throwException = false;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);
      (fs.promises.mkdir as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      const result: boolean = await service.createDirectory(name, throwException);

      expect(result).toBeFalsy();
      expect(fs.promises.mkdir).toBeCalledWith(name);
    });

    it('negative - should throw exception when can not create new directory and exception is enabled', async (done: DoneCallback) => {
      const name = 'new_directory';
      const pathExists = false;
      const throwException = true;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(pathExists);
      (fs.promises.mkdir as jest.Mock).mockImplementationOnce(() => {
        throw new Error();
      });

      try {
        await service.createDirectory(name, throwException);
        done.fail('FolderIsUnableToCreateException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(FolderIsUnableToCreateException);
        expect((e as FolderIsUnableToCreateException).path).toEqual(name);
        expect((e as FolderIsUnableToCreateException).errorCode).toEqual(MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_NOT_CREATED);
        done();
      }
    });
  });

  // describe('hashFile()', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //
  //   it('positive - should ', async () => {});
  // });
  //
  // describe('readFileStream()', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //
  //   it('positive - should ', async () => {});
  // });
  //
  // describe('readFileBuffer()', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //
  //   it('positive - should ', async () => {});
  // });
  //
  // describe('writeFileContent()', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //
  //   it('positive - should ', async () => {});
  // });
  //
  // describe('deleteFile()', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //
  //   it('positive - should ', async () => {});
  // });
  //
  describe('rename()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should rename file', async () => {
      const oldPath = 'oldPath';
      const newPath = 'newPath';

      await service.rename(oldPath, newPath);

      expect(fs.promises.rename as jest.Mock).toBeCalledWith(oldPath, newPath);
    });
  });
  //
  describe('existsFile()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should check if file exists', async () => {
      const filePath = 'filePath';
      const exists = true;

      (fs.existsSync as jest.Mock).mockReturnValueOnce(exists);

      const result: boolean = await service.existsFile(filePath);

      expect(result).toEqual(exists);
      expect(fs.existsSync).toBeCalledWith(filePath);
    });
  });

  describe('isDirectory()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should check if path is directory', async () => {
      const dirPath = 'dirPath';
      const stats = fakeFileStats();
      const isDirectory = true;

      stats.isDirectory.mockReturnValueOnce(isDirectory);

      (fs.statSync as jest.Mock).mockReturnValueOnce(stats);

      const result: boolean = await service.isDirectory(dirPath);

      expect(result).toEqual(isDirectory);
      expect(fs.statSync).toBeCalledWith(dirPath);
    });
  });

  describe('getParentDirectory()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('positive - should return parent directory', async () => {
      const parent = 'parent';
      const file = 'file';
      const dirPath = path.join(parent, file);

      const result = service.getParentDirectory(dirPath);

      expect(result).toEqual(parent);
    });
  });
});
