import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';

import { createEmptyExperiment, createEmptyExperimentResult, createEmptySequence, ExperimentResult, Sequence } from '@stechy1/diplomka-share';

import {
  ExperimentClearCommand,
  ExperimentSetupCommand,
  ExperimentUploadCommand,
  SendStimulatorStateChangeToClientCommand,
} from '@diplomka-backend/stim-feature-stimulator/application';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { PrepareNextExperimentRoundCommand } from '../impl/prepare-next-experiment-round.command';
import { PrepareNextExperimentRoundHandler } from './prepare-next-experiment-round.handler';

describe('PrepareNextExperimentRoundHandler', () => {
  let testingModule: TestingModule;
  let handler: PrepareNextExperimentRoundHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        PrepareNextExperimentRoundHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<PrepareNextExperimentRoundHandler>(PrepareNextExperimentRoundHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should prepare next experiment round', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.experimentID = 1;
    const stimulatorStateData: StimulatorStateData = { state: 0, name: 'name', noUpdate: false, timestamp: Date.now() };
    const sequence: Sequence = createEmptySequence();
    sequence.size = 10;
    const userID = 0;
    const command = new PrepareNextExperimentRoundCommand(userID);

    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => experimentResult),
    });

    Object.defineProperty(service, 'sequence', {
      get: jest.fn(() => sequence),
    });

    commandBus.execute.mockReturnValueOnce(null);
    commandBus.execute.mockReturnValueOnce(null);
    commandBus.execute.mockReturnValueOnce(stimulatorStateData);

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new ExperimentClearCommand(true)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new ExperimentUploadCommand(experimentResult.experimentID, userID, sequence.size, true)]);
    expect(commandBus.execute.mock.calls[2]).toEqual([new ExperimentSetupCommand(experimentResult.experimentID, true)]);
    expect(commandBus.execute.mock.calls[3]).toEqual([new SendStimulatorStateChangeToClientCommand(stimulatorStateData.state)]);
  });
});
