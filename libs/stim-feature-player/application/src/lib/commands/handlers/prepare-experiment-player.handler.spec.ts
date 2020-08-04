import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { PlayerConfiguration } from '@stechy1/diplomka-share';

import { ExperimentStopCondition, ExperimentStopConditionFactory } from '@diplomka-backend/stim-feature-player/domain';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';
import { PrepareExperimentPlayerCommand } from '../impl/prepare-experiment-player.command';
import { PrepareExperimentPlayerHandler } from './prepare-experiment-player.handler';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

describe('PrepareExperimentPlayerHandler', () => {
  let testingModule: TestingModule;
  let handler: PrepareExperimentPlayerHandler;
  let experimentStopConditionFactory: MockType<ExperimentStopConditionFactory>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PrepareExperimentPlayerHandler, commandBusProvider, { provide: ExperimentStopConditionFactory, useFactory: jest.fn(() => ({ createCondition: jest.fn() })) }],
    }).compile();

    handler = testingModule.get<PrepareExperimentPlayerHandler>(PrepareExperimentPlayerHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    experimentStopConditionFactory = testingModule.get<MockType<ExperimentStopConditionFactory>>(ExperimentStopConditionFactory);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should prepare experiment player', async () => {
    const experimentID = 1;
    const playerConfiguration: PlayerConfiguration = {
      repeat: 0,
      betweenExperimentInterval: 0,
      autoplay: false,
      stopConditionType: -1,
      stopConditions: {},
    };
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1 };
    const command = new PrepareExperimentPlayerCommand(experimentID, playerConfiguration);

    experimentStopConditionFactory.createCondition.mockReturnValueOnce(experimentStopCondition);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(
      new ExperimentResultInitializeCommand(
        command.experimentID,
        experimentStopCondition,
        command.playerConfiguration.repeat,
        command.playerConfiguration.betweenExperimentInterval,
        command.playerConfiguration.autoplay
      )
    );
  });
});
