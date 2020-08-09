import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

import { PrepareExperimentPlayerCommand } from '@diplomka-backend/stim-feature-player/application';

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
      const playerConfiguration: PlayerConfiguration = {
        repeat: 0,
        betweenExperimentInterval: 0,
        autoplay: false,
        stopConditionType: -1,
        stopConditions: {},
      };

      await facade.prepare(experimentID, playerConfiguration);

      expect(commandBus.execute).toBeCalledWith(new PrepareExperimentPlayerCommand(experimentID, playerConfiguration));
    });
  });
});
