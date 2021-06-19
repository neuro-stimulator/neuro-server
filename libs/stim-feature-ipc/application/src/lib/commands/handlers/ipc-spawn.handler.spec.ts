import { Test, TestingModule } from '@nestjs/testing';

import { Settings } from '@stechy1/diplomka-share';

import { SettingsFacade } from '@diplomka-backend/stim-feature-settings';
import { ASSET_PLAYER_MODULE_CONFIG_CONSTANT, AssetPlayerModuleConfig } from '@diplomka-backend/stim-feature-ipc/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { IpcService } from '../../services/ipc.service';
import { createIpcServiceMock } from '../../services/ipc.service.jest';
import { IpcSpawnCommand } from '../impl/ipc-spawn.command';
import { IpcSpawnHandler } from './ipc-spawn.handler';

describe('IpcSpawnHandler', () => {
  const defaultModuleConfig: AssetPlayerModuleConfig = {
    pythonPath: '',
    path: '',
    communicationPort: 8080,
    frameRate: 64,
    openPortAutomatically: false
  };
  const settings: Settings = { assetPlayer: { fullScreen: false, width: 800, height: 600 }  };

  let testingModule: TestingModule;
  let handler: IpcSpawnHandler;
  let service: MockType<IpcService>;
  let settingsFacade: MockType<SettingsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        IpcSpawnHandler,
        {
          provide: ASSET_PLAYER_MODULE_CONFIG_CONSTANT,
          useValue: defaultModuleConfig
        },
        {
          provide: IpcService,
          useFactory: createIpcServiceMock,
        },
        {
          provide: SettingsFacade,
          useFactory: jest.fn(() => ({ getSettings: jest.fn() })),
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<IpcSpawnHandler>(IpcSpawnHandler);
    // @ts-ignore
    service = testingModule.get<MockType<IpcService>>(IpcService);
    // @ts-ignore
    settingsFacade = testingModule.get<MockType<SettingsFacade>>(SettingsFacade);
    settingsFacade.getSettings.mockReturnValue(settings);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call spawn service method', async () => {
    const command = new IpcSpawnCommand();

    await handler.execute(command);

    expect(service.spawn).toBeCalledWith(
      defaultModuleConfig,
      settings.assetPlayer
    );
  });
});
