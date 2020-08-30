import { Test, TestingModule } from '@nestjs/testing';

import { SaveSerialPathIfNecessaryCommand } from '@diplomka-backend/stim-feature-stimulator/application';

import { MockType } from 'test-helpers/test-helpers';

import { SaveSerialPathIfNecessaryHandler } from './save-serial-path-if-necessary.handler';
import { Settings, SettingsFacade } from '@diplomka-backend/stim-feature-settings';

describe('SaveSerialPathIfNecessaryHandler', () => {
  let testingModule: TestingModule;
  let handler: SaveSerialPathIfNecessaryHandler;
  let facade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SaveSerialPathIfNecessaryHandler,
        {
          provide: SettingsFacade,
          useFactory: jest.fn(() => ({ getSettings: jest.fn(), updateSettings: jest.fn() })),
        },
      ],
    }).compile();

    handler = testingModule.get<SaveSerialPathIfNecessaryHandler>(SaveSerialPathIfNecessaryHandler);
    // @ts-ignore
    facade = testingModule.get<MockType<SettingsFacade>>(SettingsFacade);
  });

  it('positive - should not save path', async () => {
    const path = 'path';
    const settings: Settings = {};
    settings.autoconnectToStimulator = false;
    const command = new SaveSerialPathIfNecessaryCommand(path);

    facade.getSettings.mockReturnValueOnce(settings);

    await handler.execute(command);

    expect(facade.updateSettings).not.toBeCalled();
  });

  it('positive - should save path', async () => {
    const path = 'path';
    const settings: Settings = {};
    settings.autoconnectToStimulator = true;
    const command = new SaveSerialPathIfNecessaryCommand(path);

    facade.getSettings.mockReturnValueOnce(settings);

    await handler.execute(command);

    expect(facade.updateSettings).toBeCalledWith({ ...settings, comPortName: path });
  });
});
