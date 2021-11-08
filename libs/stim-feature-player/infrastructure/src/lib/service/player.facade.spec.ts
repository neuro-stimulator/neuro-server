import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, ExperimentType, Output, PlayerConfiguration } from '@stechy1/diplomka-share';

import { PlayerConfigurationQuery, PrepareExperimentPlayerCommand, StopConditionTypesQuery } from '@neuro-server/stim-feature-player/application';

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
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
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
      const userID = 1;
      const userGroups = [1];

      commandBus.execute.mockReturnValueOnce(experimentResult);

      const result = await facade.prepare(experiment.id, playerConfiguration, userID, userGroups);

      expect(commandBus.execute).toBeCalledWith(new PrepareExperimentPlayerCommand(experiment.id, playerConfiguration, userID, userGroups));
      expect(result).toEqual(experimentResult);
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
