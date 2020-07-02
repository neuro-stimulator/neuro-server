import { ReadStream } from 'fs';
import { Test, TestingModule } from '@nestjs/testing';

import { MockType } from 'test-helpers/test-helpers';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { FileNotFoundException } from '../../../domain/exception/file-not-found.exception';
import { GetContentQuery } from '../impl/get-content.query';
import { GetContentHandler } from './get-content.handler';
import DoneCallback = jest.DoneCallback;

describe('GetContentHandler', () => {
  let testingModule: TestingModule;
  let handler: GetContentHandler;
  let service: MockType<FileBrowserService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        GetContentHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<GetContentHandler>(GetContentHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should return list of file records in public directory', async () => {
    const folderPath = 'file/path';
    const files: FileRecord[] = [];
    const query = new GetContentQuery(folderPath, 'public');

    service.mergePublicPath.mockReturnValue('');
    service.isDirectory.mockReturnValue(true);
    service.getFilesFromDirectory.mockReturnValue(files);

    const result: FileRecord[] | ReadStream | string = await handler.execute(query);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toEqual(files);
  });

  it('positive - should return list of file records in private directory', async () => {
    const folderPath = 'file/path';
    const files: FileRecord[] = [];
    const query = new GetContentQuery(folderPath, 'private');

    service.mergePrivatePath.mockReturnValue('');
    service.isDirectory.mockReturnValue(true);
    service.getFilesFromDirectory.mockReturnValue(files);

    const result: FileRecord[] | ReadStream | string = await handler.execute(query);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toEqual(files);
  });

  it('negative - should throw FileNotFoundException when file is not found', async (done: DoneCallback) => {
    const folderPath = 'file/path';
    const query = new GetContentQuery(folderPath, 'public');

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(folderPath);
    });

    try {
      await handler.execute(query);
      done.fail('FileNotFoundException was not thrown!');
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        expect(e.path).toEqual(folderPath);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw FileNotFoundException when file is not found', async (done: DoneCallback) => {
    const folderPath = 'file/path';
    const query = new GetContentQuery(folderPath, 'public');

    service.mergePublicPath.mockReturnValue('');
    service.isDirectory.mockReturnValue(true);
    service.getFilesFromDirectory.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(query);
      done.fail('FileNotFoundException was not thrown!');
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        expect(e.path).toEqual(folderPath);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
