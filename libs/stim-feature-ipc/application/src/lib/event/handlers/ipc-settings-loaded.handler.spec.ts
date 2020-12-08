import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Settings } from '@stechy1/diplomka-share';

import { SettingsWasLoadedEvent } from '@diplomka-backend/stim-feature-settings';

import { MockType, commandBusProvider, NoOpLogger } from 'test-helpers/test-helpers';

import { IpcOpenCommand } from '../../commands/impl/ipc-open.command';
import { IpcSettingsLoadedHandler } from './ipc-settings-loaded.handler';

describe('IpcSettingsLoadedHandler', () => {
  let testingModule: TestingModule;
  let handler: IpcSettingsLoadedHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [IpcSettingsLoadedHandler, commandBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcSettingsLoadedHandler>(IpcSettingsLoadedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call command to open ipc socket', async () => {
    const settings: Settings = {};
    const event = new SettingsWasLoadedEvent(settings);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new IpcOpenCommand());
  });
});
