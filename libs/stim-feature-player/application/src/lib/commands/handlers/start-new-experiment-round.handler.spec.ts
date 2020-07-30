import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { commandBusProvider, MockType } from 'test-helpers/test-helpers';

import { StartNewExperimentRoundHandler } from './start-new-experiment-round.handler';
import { StartNewExperimentRoundCommand } from '../impl/start-new-experiment-round.command';
import { CreateNewExperimentRoundToClientCommand } from '../impl/to-client/create-new-experiment-round-to-client.command';
import { FillInitialIoDataCommand } from '../impl/fill-initial-io-data.command';

describe('StartNewExperimentRoundHandler', () => {
  let testingModule: TestingModule;
  let handler: StartNewExperimentRoundHandler;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [StartNewExperimentRoundHandler, commandBusProvider],
    }).compile();

    handler = testingModule.get<StartNewExperimentRoundHandler>(StartNewExperimentRoundHandler);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should start new experiment round', async () => {
    const timestamp = 0;
    const command = new StartNewExperimentRoundCommand(timestamp);

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new CreateNewExperimentRoundToClientCommand()]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new FillInitialIoDataCommand(timestamp)]);
  });
});
