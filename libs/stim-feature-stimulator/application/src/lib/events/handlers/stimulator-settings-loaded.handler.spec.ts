import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { Settings } from '@stechy1/diplomka-share';

import { SettingsWasLoadedEvent, UpdateSettingsCommand } from '@neuro-server/stim-feature-settings';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { OpenCommand } from '../../commands/impl/open.command';

import { StimulatorSettingsLoadedHandler } from './stimulator-settings-loaded.handler';

describe('StimulatorSettingsLoadedHandler', () => {
  let testingModule: TestingModule;
  let handler: StimulatorSettingsLoadedHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StimulatorSettingsLoadedHandler,
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<StimulatorSettingsLoadedHandler>(StimulatorSettingsLoadedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should not open serial port automaticaly', async () => {
    const settings: Settings = {};
    settings.autoconnectToStimulator = false;
    const event = new SettingsWasLoadedEvent(settings);

    await handler.handle(event);

    expect(commandBus.execute).not.toBeCalled();
  });

  it('positive - should disable automatic port open when path is undefined', async () => {
    const settings: Settings = {};
    settings.autoconnectToStimulator = true;
    const event = new SettingsWasLoadedEvent(settings);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new UpdateSettingsCommand({ ...settings, autoconnectToStimulator: false }))
  });

  it('positive - should automaticaly open serial port', async () => {
    const settings: Settings = {};
    settings.autoconnectToStimulator = true;
    settings.comPortName = 'comPortName';
    const event = new SettingsWasLoadedEvent(settings);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new OpenCommand(settings.comPortName));
  });
});
