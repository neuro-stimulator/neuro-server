import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult, IOEvent } from '@stechy1/diplomka-share';

import { ExperimentResultIsNotInitializedException } from '@neuro-server/stim-feature-player/domain';
import { ExperimentFinishCommand } from '@neuro-server/stim-feature-stimulator/application';

import { commandBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { AppendExperimentResultDataCommand } from '../impl/append-experiment-result-data.command';
import { ProcessStimulatorIoDataCommand } from '../impl/process-stimulator-io-data.command';
import { SendStimulatorIoDataToClientCommand } from '../impl/to-client/send-stimulator-io-data-to-client.command';

import { ProcessStimulatorIoDataHandler } from './process-stimulator-io-data.handler';

describe('ProcessStimulatorIoDataHandler', () => {
  let testingModule: TestingModule;
  let handler: ProcessStimulatorIoDataHandler;
  let service: MockType<PlayerService>;
  let commandBus: MockType<CommandBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ProcessStimulatorIoDataHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        commandBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ProcessStimulatorIoDataHandler>(ProcessStimulatorIoDataHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('positive - should handle incomming io data - experiment can continue', async () => {
    const ioData: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const canExperimentContinue = true;
    experimentResult.experimentID = 1;
    const command = new ProcessStimulatorIoDataCommand(ioData);

    Object.defineProperty(service, 'canExperimentContinue', {
      get: jest.fn(() => canExperimentContinue),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => experimentResult),
    });

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new AppendExperimentResultDataCommand(command.data)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new SendStimulatorIoDataToClientCommand(command.data)]);
  });

  it('positive - should handle incomming io data - experiment can not continue', async () => {
    const ioData: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const canExperimentContinue = false;
    experimentResult.experimentID = 1;
    const command = new ProcessStimulatorIoDataCommand(ioData);

    Object.defineProperty(service, 'canExperimentContinue', {
      get: jest.fn(() => canExperimentContinue),
    });
    Object.defineProperty(service, 'activeExperimentResult', {
      get: jest.fn(() => experimentResult),
    });

    await handler.execute(command);

    expect(commandBus.execute.mock.calls[0]).toEqual([new AppendExperimentResultDataCommand(command.data)]);
    expect(commandBus.execute.mock.calls[1]).toEqual([new ExperimentFinishCommand(experimentResult.experimentID, true)]);
  });

  it('negative - should not handle incomming data when experiment is not initialized', () => {
    const ioData: IOEvent = { name: 'test', state: 'off', ioType: 'output', index: 0, timestamp: 0 };
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.experimentID = 1;
    const command = new ProcessStimulatorIoDataCommand(ioData);

    commandBus.execute.mockImplementationOnce(() => {
      throw new ExperimentResultIsNotInitializedException();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultIsNotInitializedException());
  });
});
