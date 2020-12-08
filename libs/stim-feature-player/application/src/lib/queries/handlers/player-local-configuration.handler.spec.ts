import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentStopConditionType } from '@stechy1/diplomka-share';

import { PlayerLocalConfiguration } from '@diplomka-backend/stim-feature-player/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerService } from '../../service/player.service';
import { PlayerLocalConfigurationQuery } from '../impl/player-local-configuration.query';
import { PlayerLocalConfigurationHandler } from './player-local-configuration.handler';

describe('PlayerLocalConfigurationHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerLocalConfigurationHandler;
  let service: MockType<PlayerService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerLocalConfigurationHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<PlayerLocalConfigurationHandler>(PlayerLocalConfigurationHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should return local player configuration', async () => {
    const playerLocalConfiguration: PlayerLocalConfiguration = {
      userID: 0,
      autoplay: false,
      stopConditions: {},
      stopConditionType: ExperimentStopConditionType.NO_STOP_CONDITION,
      betweenExperimentInterval: 0,
      initialized: false,
      ioData: [],
      isBreakTime: false,
      repeat: 0,
    };
    const query = new PlayerLocalConfigurationQuery();

    Object.defineProperty(service, 'playerLocalConfiguration', {
      get: jest.fn(() => playerLocalConfiguration),
    });

    const configuration: PlayerLocalConfiguration = await handler.execute(query);

    expect(configuration).toBe(playerLocalConfiguration);
  });
});
