import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { ContentWasNotWrittenException } from '../../../domain/exception/content-was-not-written.exception';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
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

  it('negative - should throw exception when can not write file content', async (done: DoneCallback) => {
    const path = '';
    const content = { hello: 'world' };
    const command = new WritePrivateJSONFileCommand(path, content);

    service.writeFileContent.mockImplementationOnce(() => {
      throw new ContentWasNotWrittenException(path, content);
    });

    try {
      await handler.execute(command);
      done.fail('ContentWasNotWrittenException was not thrown!');
    } catch (e) {
      if (e instanceof ContentWasNotWrittenException) {
        expect(e.path).toEqual(path);
        expect(e.content).toEqual(content);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
