import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { FileAccessRestrictedException } from '../../../domain/exception/file-access-restricted.exception';
import { FileNotFoundException } from '../../../domain/exception/file-not-found.exception';
import { MergePrivatePathQuery } from '../impl/merge-private-path.query';
import { MergePrivatePathHandler } from './merge-private-path.handler';

describe('MergePrivatePathHandler', () => {
  let testingModule: TestingModule;
  let handler: MergePrivatePathHandler;
  let service: MockType<FileBrowserService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        MergePrivatePathHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
      ],
    }).compile();

    handler = testingModule.get<MergePrivatePathHandler>(MergePrivatePathHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
  });

  it('positive - should merge private path', async () => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePrivatePathQuery(path);

    service.mergePrivatePath.mockReturnValue(mergedPath);

    const result: string = await handler.execute(query);

    expect(result).toEqual(mergedPath);
  });

  it('negative - should throw FileAccessRestrictedException when file is in restricted path', async (done: DoneCallback) => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePrivatePathQuery(path);

    service.mergePrivatePath.mockImplementation(() => {
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
    const query = new MergePrivatePathQuery(path, true);

    service.mergePrivatePath.mockImplementation(() => {
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
