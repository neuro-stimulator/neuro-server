import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { PrepareExperimentPlayerCommand } from '@diplomka-backend/stim-feature-player/application';
import { ExperimentEndConditionParams, ExperimentEndConditionType, PlayerConfigurationDTO } from '@diplomka-backend/stim-feature-player/domain';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';
import { PlayerFacade } from './player.facade';

describe('PlayerFacade', () => {
  let testingModule: TestingModule;
  let facade: PlayerFacade;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PlayerFacade, commandBusProvider],
    }).compile();

    facade = testingModule.get<PlayerFacade>(PlayerFacade);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  describe('prepare()', () => {
    it('positive - should call ', async () => {
      const experimentID = 1;
      const conditionType: ExperimentEndConditionType = ExperimentEndConditionType.COUNTING_EXPERIMENT_END_CONDITION;
      const playerConfiguration: PlayerConfigurationDTO = new PlayerConfigurationDTO();

      await facade.prepare(experimentID, conditionType, playerConfiguration);

      expect(commandBus.execute).toBeCalledWith(new PrepareExperimentPlayerCommand(experimentID, conditionType, playerConfiguration));
    });
  });
});
