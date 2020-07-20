import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { FileAccessRestrictedException } from '../../../domain/exception/file-access-restricted.exception';
import { FileNotFoundException } from '../../../domain/exception/file-not-found.exception';
import { MergePublicPathQuery } from '../impl/merge-public-path.query';
import { MergePublicPathHandler } from './merge-public-path.handler';

describe('MergePublicPathHandler', () => {
  let testingModule: TestingModule;
  let handler: MergePublicPathHandler;
  let service: MockType<FileBrowserService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        MergePublicPathHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<MergePublicPathHandler>(MergePublicPathHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
  });

  it('positive - should merge public path', async () => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePublicPathQuery(path);

    service.mergePublicPath.mockReturnValue(mergedPath);

    const result: string = await handler.execute(query);

    expect(result).toEqual(mergedPath);
  });

  it('negative - should throw FileAccessRestrictedException when file is in restricted path', async (done: DoneCallback) => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePublicPathQuery(path);

    service.mergePublicPath.mockImplementation(() => {
      throw new FileAccessRestrictedException(mergedPath);
    });

    try {
      await handler.execute(query);
      done.fail('FileAccessRestrictedException was not thrown');
    } catch (e) {
      if (e instanceof FileAccessRestrictedException) {
        expect(e.restrictedPath).toEqual(mergedPath);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw FileNotFoundException when file is not found', async (done: DoneCallback) => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePublicPathQuery(path, true);

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(mergedPath);
    });

    try {
      await handler.execute(query);
      done.fail('FileNotFoundException was not thrown');
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        expect(e.path).toEqual(mergedPath);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
