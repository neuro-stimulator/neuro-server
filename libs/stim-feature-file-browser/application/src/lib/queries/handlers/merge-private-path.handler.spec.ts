import { Test, TestingModule } from '@nestjs/testing';

import { FileAccessRestrictedException, FileNotFoundException } from '@neuro-server/stim-feature-file-browser/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../service/file-browser.service';
import { createFileBrowserServiceMock } from '../../service/file-browser.service.jest';
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
    testingModule.useLogger(new NoOpLogger());

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

  it('negative - should throw FileAccessRestrictedException when file is in restricted path', () => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePrivatePathQuery(path);

    service.mergePrivatePath.mockImplementation(() => {
      throw new FileAccessRestrictedException(mergedPath);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(mergedPath));
  });

  it('negative - should throw FileNotFoundException when file is not found', () => {
    const path = 'path';
    const mergedPath = `base/${path}`;
    const query = new MergePrivatePathQuery(path, true);

    service.mergePrivatePath.mockImplementation(() => {
      throw new FileNotFoundException(mergedPath);
    });

    expect(() => handler.execute(query)).rejects.toThrow(new FileNotFoundException(mergedPath));
  });
});
