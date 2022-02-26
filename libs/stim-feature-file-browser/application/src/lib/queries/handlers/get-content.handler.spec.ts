import { ReadStream } from 'fs';

import { Test, TestingModule } from '@nestjs/testing';


import { FileRecord } from '@stechy1/diplomka-share';

import { FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../service/file-browser.service';
import { createFileBrowserServiceMock } from '../../service/file-browser.service.jest';
import { GetContentQuery } from '../impl/get-content.query';

import { GetContentHandler } from './get-content.handler';

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
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw FileNotFoundException when file is not found', () => {
    const folderPath = 'file/path';
    const query = new GetContentQuery(folderPath, 'public');

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(folderPath);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(folderPath));
  });

  it('negative - should throw FileNotFoundException when file is not found', () => {
    const folderPath = 'file/path';
    const query = new GetContentQuery(folderPath, 'public');

    service.mergePublicPath.mockReturnValue('');
    service.isDirectory.mockReturnValue(true);
    service.getFilesFromDirectory.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(folderPath));
  });
});
