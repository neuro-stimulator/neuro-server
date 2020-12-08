import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, Output } from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import { AnotherExperimentResultIsInitializedException, ExperimentStopCondition } from '@diplomka-backend/stim-feature-player/domain';

import { eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

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
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should initialize new experiment result', async () => {
    const userID = 0;
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experiment);
    service.createEmptyExperimentResult.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasInitializedEvent(experimentResult));
  });

  it('negative - should throw exception when experiment is not found', async (done: DoneCallback) => {
    const userID = 0;
    const experimentID = 1;
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockImplementationOnce(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentIdNotFoundException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        expect(e.experimentID).toBe(experimentID);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when another experiment is initialized', async (done: DoneCallback) => {
    const userID = 0;
    const experimentID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const experimentStopCondition: ExperimentStopCondition = { canContinue: jest.fn(), stopConditionType: -1, stopConditionParams: {} };
    const experimentRepeat = 1;
    const betweenExperimentInterval = 1;
    const autoplay = false;
    const command = new ExperimentResultInitializeCommand(userID, experimentID, experimentStopCondition, experimentRepeat, betweenExperimentInterval, autoplay);

    queryBus.execute.mockReturnValueOnce(experimentID);
    queryBus.execute.mockReturnValueOnce(experiment);
    service.createEmptyExperimentResult.mockImplementation(() => {
      throw new AnotherExperimentResultIsInitializedException(experimentResult, experiment);
    });

    try {
      await handler.execute(command);
      done.fail('AnotherExperimentResultIsInitializedException was not thrown!');
    } catch (e) {
      if (e instanceof AnotherExperimentResultIsInitializedException) {
        expect(e.initializedExperimentResult).toEqual(experimentResult);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
