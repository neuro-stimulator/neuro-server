import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, createEmptySequence, Experiment, ExperimentResult, Output, Sequence } from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundException } from '@neuro-server/stim-feature-experiments/domain';
import { AnotherExperimentResultIsInitializedException, ExperimentStopCondition } from '@neuro-server/stim-feature-player/domain';
import { SequenceIdNotFoundException } from '@neuro-server/stim-feature-sequences/domain';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { PlayerService } from '../../service/player.service';
import { createPlayerServiceMock } from '../../service/player.service.jest';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

import { ExperimentResultInitializeHandler } from './experiment-result-initialize.handler';

describe('ExpeirmentResultInitializeHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultInitializeHandler;
  let service: MockType<PlayerService>;
  let queryBus: MockType<QueryBus>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultInitializeHandler,
        {
          provide: PlayerService,
          useFactory: createPlayerServiceMock,
        },
        queryBusProvider,
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultInitializeHandler>(ExperimentResultInitializeHandler);
    // @ts-ignore
    service = testingModule.get<MockType<PlayerService>>(PlayerService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should initialize new experiment result for experiment without sequence', async () => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    service.createEmptyExperimentResult.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasInitializedEvent(experimentResult));
  });

  it('positive - should initialize new experiment result for experiment with sequence', async () => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const sequence: Sequence = createEmptySequence();
    sequence.experimentId = experiment.id;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    queryBus.execute.mockReturnValueOnce(sequence);
    service.createEmptyExperimentResult.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasInitializedEvent(experimentResult));
  });

  it('positive - should initialize new experiment result for experiment with missing sequence', async() => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const sequenceID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const sequenceData: number[] = [1, 2, 3];
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    queryBus.execute.mockImplementationOnce(() => {
      throw new SequenceIdNotFoundException(sequenceID);
    });
    commandBus.execute.mockReturnValueOnce(sequenceData);
    service.createEmptyExperimentResult.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasInitializedEvent(experimentResult));
  });

  it('negative - should throw exception when experiment is not found', () => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockImplementationOnce(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentIdNotFoundException(experimentID));
  });

  it('negative - should throw exception when another experiment is initialized', () => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    service.createEmptyExperimentResult.mockImplementation(() => {
      throw new AnotherExperimentResultIsInitializedException(experimentResult, experiment);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new AnotherExperimentResultIsInitializedException(experimentResult, experiment));
  });

  it('negative - should throw exception when error when loading sequence occured', () => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.supportSequences = true;
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    queryBus.execute.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new Error());
  });

  it('negative - should throw exception when sequence query failed', () => {
    const userID = 0;
    const userGroups = [1];
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = experimentID;
    experiment.supportSequences = true;
    const sequence: Sequence = createEmptySequence();
    sequence.experimentId = experiment.id;
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, userGroups, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    queryBus.execute.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrowError();
  })
});
