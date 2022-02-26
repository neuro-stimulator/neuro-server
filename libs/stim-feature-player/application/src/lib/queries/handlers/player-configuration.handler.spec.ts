import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentStopConditionType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PlayerConfigurationQuery } from '../impl/player-configuration.query';

import { PlayerConfigurationHandler } from './player-configuration.handler';

describe('PlayerConfigurationHandler', () => {
  let testingModule: TestingModule;
  let handler: PlayerConfigurationHandler;
  let service: MockType<PlayerService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PlayerConfigurationHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<PlayerConfigurationHandler>(PlayerConfigurationHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should return complete player configuration', async () => {
    const playerConfiguration: PlayerConfiguration = {
      autoplay: false,
      stopConditions: {},
      stopConditionType: ExperimentStopConditionType.NO_STOP_CONDITION,
      betweenExperimentInterval: 0,
      initialized: false,
      ioData: [],
      isBreakTime: false,
      repeat: 0,
    };
    const query = new PlayerConfigurationQuery();

    Object.defineProperty(service, 'playerConfiguration', {
      get: jest.fn(() => playerConfiguration),
    });

    const configuration: PlayerConfiguration = await handler.execute(query);

    expect(configuration).toBe(playerConfiguration);
  });
});
