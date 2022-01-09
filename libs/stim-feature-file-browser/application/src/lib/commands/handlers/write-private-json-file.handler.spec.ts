import { Test, TestingModule } from '@nestjs/testing';

import { ContentWasNotWrittenException } from '@neuro-server/stim-feature-file-browser/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../service/file-browser.service';
import { createFileBrowserServiceMock } from '../../service/file-browser.service.jest';
import { WritePrivateJSONFileCommand } from '../impl/write-private-json-file.command';
import { WritePrivateJsonFileHandler } from './write-private-json-file.handler';

describe('WritePrivateJsonFileHandler', () => {
  let testingModule: TestingModule;
  let handler: WritePrivateJsonFileHandler;
  let service: MockType<FileBrowserService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        WritePrivateJsonFileHandler,
        {
          provide: FileBrowserService,
          useFactory: createFileBrowserServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<WritePrivateJsonFileHandler>(WritePrivateJsonFileHandler);
    // @ts-ignore
    service = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should delete write json content to file', async () => {
    const path = '';
    const content = { hello: 'world' };
    const command = new WritePrivateJSONFileCommand(path, content);

    service.writeFileContent.mockReturnValue(true);

    await handler.execute(command);

    expect(service.writeFileContent).toBeCalledWith(path, JSON.stringify(content));
  });

  it('negative - should throw exception when can not write file content', () => {
    const path = '';
    const content = { hello: 'world' };
    const command = new WritePrivateJSONFileCommand(path, content);

    service.writeFileContent.mockImplementationOnce(() => {
      throw new ContentWasNotWrittenException(path, content);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ContentWasNotWrittenException(path, content));
  });
});
