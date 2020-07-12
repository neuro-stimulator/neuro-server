import { Response } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { FileRecord, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';

import { MockType } from 'test-helpers/test-helpers';

import { FileNotFoundException } from '../../domain/exception/file-not-found.exception';
import { FolderIsUnableToCreateException } from '../../domain/exception/folder-is-unable-to-create.exception';
import { FileAlreadyExistsException } from '../../domain/exception/file-already-exists.exception';
import { FileAccessRestrictedException } from '../../domain/exception/file-access-restricted.exception';
import { UploadedFileStructure } from '../../domain/model/uploaded-file-structure';
import { FileBrowserFacade } from '../service/file-browser.facade';
import { createFileBrowserFacadeMock } from '../service/file-browser.facade.jest';
import { FileBrowserController } from './file-browser.controller';

describe('FileBrowserController', () => {
  let testingModule: TestingModule;
  let controller: FileBrowserController;
  let facade: MockType<FileBrowserFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [FileBrowserController],
      providers: [
        {
          provide: FileBrowserFacade,
          useFactory: createFileBrowserFacadeMock,
        },
      ],
    }).compile();
    controller = testingModule.get<FileBrowserController>(FileBrowserController);
    // @ts-ignore
    facade = testingModule.get<MockType<FileBrowserFacade>>(FileBrowserFacade);
  });

  afterEach(() => {});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRootFolderContent()', () => {
    it('positive - should return content of public root folder', async () => {
      const content: FileRecord[] = [];

      facade.getContent.mockReturnValue(content);

      const result: ResponseObject<FileRecord[]> = await controller.getRootFolderContent();
      const expected: ResponseObject<FileRecord[]> = { data: content };

      expect(result).toEqual(expected);
    });
  });

  describe('getContent()', () => {
    let responseMock: MockType<Response>;

    beforeEach(() => {
      // @ts-ignore
      responseMock = {
        sendFile: jest.fn(),
        setHeader: jest.fn(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      responseMock.sendFile.mockClear();
      responseMock.setHeader.mockClear();
      responseMock.json.mockClear();
    });

    it('positive - should return list of files in root folder', async () => {
      const content: FileRecord[] = [];
      const params: { [index: number]: string } = {};

      facade.getContent.mockReturnValue(content);

      // @ts-ignore
      await controller.getContent(params, responseMock);
      const expected: ResponseObject<FileRecord[]> = { data: content };

      expect(responseMock.sendFile).not.toBeCalled();
      expect(responseMock.json).toBeCalledWith(expected);
    });

    it('positive - should return file from filepath', async () => {
      const filePath = 'file/path';
      const params: { [index: number]: string } = {};

      facade.getContent.mockReturnValue(filePath);

      // @ts-ignore
      await controller.getContent(params, responseMock);

      expect(responseMock.sendFile).toBeCalledWith(filePath);
      expect(responseMock.json).not.toBeCalled();
    });

    it('negative - should throw ControllerException when file not found', async (done: DoneCallback) => {
      const filePath = 'file/path';
      const params: { [index: number]: string } = {};

      facade.getContent.mockImplementation(() => {
        throw new FileNotFoundException(filePath);
      });

      try {
        // @ts-ignore
        await controller.getContent(params, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode === MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
          expect(e.params).toEqual({ path: filePath });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when unknown error occured', async (done: DoneCallback) => {
      const params: { [index: number]: string } = {};

      facade.getContent.mockImplementation(() => {
        throw new Error();
      });

      try {
        // @ts-ignore
        await controller.getContent(params, responseMock);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode === MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('createNewFolder()', () => {
    it('positive - should create new folder in root directory', async () => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };
      const files: FileRecord[] = [newFileRecord];

      facade.createNewFolder.mockReturnValue(['/', newFileRecord.name]);
      facade.getContent.mockReturnValue(files);

      const result: ResponseObject<FileRecord[]> = await controller.createNewFolder(params);
      const expected: ResponseObject<FileRecord[]> = {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_CREATED,
          params: {
            name: newFileRecord.name,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should throw ControllerException when folder is unable to create', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };

      facade.createNewFolder.mockImplementation(() => {
        throw new FolderIsUnableToCreateException(newFileRecord.path);
      });

      try {
        await controller.createNewFolder(newFileRecord.path);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_NOT_CREATED);
          expect(error.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when file already exists', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };

      facade.createNewFolder.mockImplementation(() => {
        throw new FileAlreadyExistsException(newFileRecord.path);
      });

      try {
        await controller.createNewFolder(newFileRecord.path);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ALREADY_EXISTS);
          expect(error.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when file path has restricted access', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };

      facade.createNewFolder.mockImplementation(() => {
        throw new FileAccessRestrictedException(newFileRecord.path);
      });

      try {
        await controller.createNewFolder(newFileRecord.path);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED);
          expect(error.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when parent folder not found', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };

      facade.createNewFolder.mockImplementation(() => {
        throw new FileNotFoundException(newFileRecord.path);
      });

      try {
        await controller.createNewFolder(newFileRecord.path);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
          expect(error.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when unknown error occured', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };

      facade.createNewFolder.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.createNewFolder(newFileRecord.path);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('uploadFiles()', () => {
    const file: UploadedFileStructure = { buffer: Buffer.from([]), encoding: 'utf-8', fieldname: 'fieldName', mimetype: 'text', originalname: 'originalname', size: '256' };

    it('positive - should upload file to server', async () => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };
      const files: FileRecord[] = [newFileRecord];

      facade.getContent.mockReturnValue(files);

      const result: ResponseObject<FileRecord[]> = await controller.uploadFiles([file], params);
      const expected: ResponseObject<FileRecord[]> = {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_UPLOADED,
        },
      };

      expect(result).toEqual(expected);
      expect(facade.uploadFiles).toBeCalledWith([file], params[0]);
    });

    it('negative - should throw ControllerException when file path has restricted access', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };

      facade.uploadFiles.mockImplementation(() => {
        throw new FileAccessRestrictedException(newFileRecord.path);
      });

      try {
        await controller.uploadFiles([file], params);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED);
          expect(error.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when parent directory not found', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };

      facade.uploadFiles.mockImplementation(() => {
        throw new FileNotFoundException(newFileRecord.path);
      });

      try {
        await controller.uploadFiles([file], params);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
          expect(error.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when unknown error occured', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: 'newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };

      facade.uploadFiles.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.uploadFiles([file], params);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          const error = e as ControllerException;
          expect(error.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('deleteFile()', () => {
    it('positive - should delete file', async () => {
      const newFileRecord: FileRecord = {
        path: '/newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };
      const files: FileRecord[] = [];

      facade.deleteFile.mockReturnValue('/');
      facade.getContent.mockReturnValue(files);

      const result: ResponseObject<FileRecord[]> = await controller.deleteFile(params);
      const expected: ResponseObject<FileRecord[]> = {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_DELETED,
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should throw ControllerException when file not found', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: '/newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };

      facade.deleteFile.mockImplementation(() => {
        throw new FileNotFoundException(newFileRecord.path);
      });

      try {
        await controller.deleteFile(params);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND);
          expect(e.params).toEqual({ path: newFileRecord.path });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw ControllerException when error occured', async (done: DoneCallback) => {
      const newFileRecord: FileRecord = {
        path: '/newFolder',
        isDirectory: true,
        isImage: false,
        name: 'newFolder',
        selected: false,
        extention: '',
        hash: '',
      };
      const params: { [index: number]: string } = {
        0: newFileRecord.path,
      };

      facade.deleteFile.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.deleteFile(params);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
