import { Test, TestingModule } from '@nestjs/testing';

import { TOKEN_BASE_PATH } from '@diplomka-backend/stim-feature-file-browser';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from './file-browser.service';

describe('FileBrowserService', () => {
  let testingModule: TestingModule;
  let service: FileBrowserService;

  const basePath = 'basePath';

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        FileBrowserService,
        {
          provide: TOKEN_BASE_PATH,
          useValue: basePath,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<FileBrowserService>(FileBrowserService);
  });

  it('positive - should be defined', async () => {
    expect(service).toBeDefined();
  });
});
