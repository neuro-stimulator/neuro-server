import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';
import { PrepareExperimentPlayerHandler } from './prepare-experiment-player.handler';

describe('PrepareExperimentPlayerHandler', () => {
  let testingModule: TestingModule;
  let handler: PrepareExperimentPlayerHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PrepareExperimentPlayerHandler, commandBusProvider],
    }).compile();

    handler = testingModule.get<PrepareExperimentPlayerHandler>(PrepareExperimentPlayerHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
