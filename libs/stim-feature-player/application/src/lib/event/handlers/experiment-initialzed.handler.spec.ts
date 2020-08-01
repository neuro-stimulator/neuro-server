import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { ExperimentInitializedEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { StartNewExperimentRoundCommand } from '../../commands/impl/start-new-experiment-round.command';
import { ExperimentInitializedHandler } from './experiment-initialized.handler';

describe('ExperimentInitializedHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentInitializedHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [ExperimentInitializedHandler, commandBusProvider],
    }).compile();

    handler = testingModule.get<ExperimentInitializedHandler>(ExperimentInitializedHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('positive - should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should send command for start new experiment round', async () => {
    const timestamp = 0;
    const event = new ExperimentInitializedEvent(timestamp);

    await handler.handle(event);

    expect(commandBus.execute).toBeCalledWith(new StartNewExperimentRoundCommand(timestamp));
  });
});
