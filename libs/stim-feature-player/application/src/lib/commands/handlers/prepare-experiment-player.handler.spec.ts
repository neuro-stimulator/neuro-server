import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ExperimentEndConditionFactory } from '@diplomka-backend/stim-feature-player/domain';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';
import { PrepareExperimentPlayerHandler } from './prepare-experiment-player.handler';

describe('PrepareExperimentPlayerHandler', () => {
  let testingModule: TestingModule;
  let handler: PrepareExperimentPlayerHandler;
  let experimentEndConditionFactory: ExperimentEndConditionFactory;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PrepareExperimentPlayerHandler, commandBusProvider, { provide: ExperimentEndConditionFactory, useFactory: jest.fn(() => ({ createCondition: jest.fn() })) }],
    }).compile();

    handler = testingModule.get<PrepareExperimentPlayerHandler>(PrepareExperimentPlayerHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    experimentEndConditionFactory = testingModule.get<MockType<ExperimentEndConditionFactory>>(ExperimentEndConditionFactory);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
