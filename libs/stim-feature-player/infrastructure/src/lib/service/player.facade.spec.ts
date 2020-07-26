import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

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
      const options = {};

      await facade.prepare(experimentID, options);

      expect(commandBus.execute).toBeCalledWith(new PrepareExperimentPlayerCommand(experimentID, options));
    });
  });
});
