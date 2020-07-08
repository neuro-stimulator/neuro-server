import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { createFileBrowserServiceMock } from '../../../domain/service/file-browser.service.jest';
import { WritePrivateJsonFileHandler } from './write-private-json-file.handler';
import { WritePrivateJSONFileCommand } from '../impl/write-private-json-file.command';
import { ContentWasNotWrittenException } from '@diplomka-backend/stim-feature-file-browser';

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
        eventBusProvider,
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

    service.writeFileContent.mockReturnValue(false);

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
