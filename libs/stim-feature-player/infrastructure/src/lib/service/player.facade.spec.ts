import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentType, PlayerConfiguration } from '@stechy1/diplomka-share';

import { PlayerConfigurationQuery, PrepareExperimentPlayerCommand, StopConditionTypesQuery } from '@diplomka-backend/stim-feature-player/application';

import { commandBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { PlayerFacade } from './player.facade';

describe('PlayerFacade', () => {
  let testingModule: TestingModule;
  let facade: PlayerFacade;
  let commandBus: MockType<CommandBus>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerFacade, commandBusProvider, queryBusProvider],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    facade = testingModule.get<PlayerFacade>(PlayerFacade);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
  });

  describe('prepare()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const playerConfiguration: PlayerConfiguration = {
        repeat: 0,
        betweenExperimentInterval: 0,
        autoplay: false,
        stopConditionType: -1,
        stopConditions: {},
        initialized: false,
        ioData: [],
        isBreakTime: false,
      };
      const userID = 0;

      await facade.prepare(experimentID, playerConfiguration, userID);

      expect(commandBus.execute).toBeCalledWith(new PrepareExperimentPlayerCommand(experimentID, playerConfiguration, userID));
    });
  });

  describe('getPlayerState()', () => {
    it('positive - should call', async () => {
      await facade.getPlayerState();

      expect(queryBus.execute).toBeCalledWith(new PlayerConfigurationQuery());
    });
  });

  describe('getStopConditions()', () => {
    it('positive - should call', async () => {
      const experimentType: ExperimentType = ExperimentType.NONE;

      await facade.getStopConditions(experimentType);

      expect(queryBus.execute).toBeCalledWith(new StopConditionTypesQuery(experimentType));
    });
  });
});
