import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Settings } from '@stechy1/diplomka-share';

import { UpdateSettingsCommand } from '@neuro-server/stim-feature-settings';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { SaveSerialPathIfNecessaryCommand } from '../impl/save-serial-path-if-necessary.command';

import { SaveSerialPathIfNecessaryHandler } from './save-serial-path-if-necessary.handler';

describe('SaveSerialPathIfNecessaryHandler', () => {
  let testingModule: TestingModule;
  let handler: SaveSerialPathIfNecessaryHandler;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SaveSerialPathIfNecessaryHandler,
        commandBusProvider,
        queryBusProvider
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<SaveSerialPathIfNecessaryHandler>(SaveSerialPathIfNecessaryHandler);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should not save path', async () => {
    const path = 'path';
    const settings: Settings = {};
    settings.autoconnectToStimulator = false;
    const command = new SaveSerialPathIfNecessaryCommand(path);

    queryBus.execute.mockReturnValueOnce(settings);

    await handler.execute(command);

    expect(commandBus.execute.mock.calls).toHaveLength(0);
  });

  it('positive - should save path', async () => {
    const path = 'path';
    const settings: Settings = {};
    settings.autoconnectToStimulator = true;
    const command = new SaveSerialPathIfNecessaryCommand(path);

    queryBus.execute.mockReturnValueOnce(settings);

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new UpdateSettingsCommand({ ...settings, comPortName: path })]);
  });
});
