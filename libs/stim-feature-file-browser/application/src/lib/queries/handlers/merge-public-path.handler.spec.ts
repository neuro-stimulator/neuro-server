import { Test, TestingModule } from '@nestjs/testing';

import { FileAccessRestrictedException, FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../service/file-browser.service';
import { createFileBrowserServiceMock } from '../../service/file-browser.service.jest';
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
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw FileAccessRestrictedException when file is in restricted path', () => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePublicPathQuery(path);

    service.mergePublicPath.mockImplementation(() => {
      throw new FileAccessRestrictedException(mergedPath);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(mergedPath));
  });

  it('negative - should throw FileNotFoundException when file is not found', () => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePublicPathQuery(path, true);

    service.mergePublicPath.mockImplementation(() => {
      throw new FileNotFoundException(mergedPath);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(mergedPath));
  });
});
