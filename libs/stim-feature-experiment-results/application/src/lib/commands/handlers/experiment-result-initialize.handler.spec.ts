import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { eventBusProvider, MockType } from 'test-helpers/test-helpers';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundError } from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentsFacade } from '@diplomka-backend/stim-feature-experiments/infrastructure';
import { AnotherExperimentResultIsInitializedException } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { StimulatorFacade } from '@diplomka-backend/stim-feature-stimulator/infrastructure';
import { NoUploadedExperimentException } from '@diplomka-backend/stim-feature-stimulator/domain';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';
import { ExperimentResultInitializeHandler } from './experiment-result-initialize.handler';

describe('ExpeirmentResultInitializeHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultInitializeHandler;
  let service: MockType<ExperimentResultsService>;
  let experimentsFacade: MockType<ExperimentsFacade>;
  let stimulatorFacade: MockType<StimulatorFacade>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultInitializeHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        {
          provide: ExperimentsFacade,
          useFactory: jest.fn(() => ({
            experimentByID: jest.fn(),
          })),
        },
        {
          provide: StimulatorFacade,
          useFactory: jest.fn(() => ({
            getCurrentExperimentID: jest.fn(),
          })),
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultInitializeHandler>(ExperimentResultInitializeHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    experimentsFacade = testingModule.get<MockType<ExperimentsFacade>>(ExperimentsFacade);
    // @ts-ignore
    stimulatorFacade = testingModule.get<MockType<StimulatorFacade>>(StimulatorFacade);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.pushResultData.mockClear();
    experimentsFacade.experimentByID.mockClear();
    stimulatorFacade.getCurrentExperimentID.mockClear();
  });

  it('positive - should initialize new experiment result', async () => {
    const experimentID = 1;
    const experiment: Experiment = createEmptyExperiment();
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const timestamp = 1;
    const command = new ExperimentResultInitializeCommand(timestamp);

    stimulatorFacade.getCurrentExperimentID.mockReturnValue(experimentID);
    experimentsFacade.experimentByID.mockReturnValue(experiment);
    service.createEmptyExperimentResult.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasInitializedEvent(timestamp, experimentResult));
  });

  it('negative - should throw exception when experiment is not uploaded', async (done: DoneCallback) => {
    const timestamp = 1;
    const command = new ExperimentResultInitializeCommand(timestamp);

    stimulatorFacade.getCurrentExperimentID.mockImplementation(() => {
      throw new NoUploadedExperimentException();
    });

    try {
      await handler.execute(command);
      done.fail('NoUploadedExperimentException was not thrown!');
    } catch (e) {
      if (e instanceof NoUploadedExperimentException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when experiment is not found', async (done: DoneCallback) => {
    const experimentID = 1;
    const timestamp = 1;
    const command = new ExperimentResultInitializeCommand(timestamp);

    stimulatorFacade.getCurrentExperimentID.mockReturnValue(experimentID);
    experimentsFacade.experimentByID.mockImplementation(() => {
      throw new ExperimentIdNotFoundError(experimentID);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentIdNotFoundError was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        expect(e.experimentID).toBe(experimentID);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when another experiment is initialized', async (done: DoneCallback) => {
    const experimentID = 1;
    const experiment: Experiment = createEmptyExperiment();
    const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
    const timestamp = 1;
    const command = new ExperimentResultInitializeCommand(timestamp);

    stimulatorFacade.getCurrentExperimentID.mockReturnValue(experimentID);
    experimentsFacade.experimentByID.mockReturnValue(experiment);
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
