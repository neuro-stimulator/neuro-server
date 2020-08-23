import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { commandBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { ExperimentResultIdNotFoundException, ExperimentResultNotValidException } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { ExperimentResultWasNotUpdatedException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultWasUpdatedEvent } from '../../event/impl/experiment-result-was-updated.event';
import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultUpdateCommand } from '../impl/experiment-result-update.command';
import { ExperimentResultValidateCommand } from '../impl/experiment-result-validate.command';
import { ExperimentResultUpdateHandler } from './experiment-result-update.handler';

describe('ExperimentResultUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultUpdateHandler;
  let service: MockType<ExperimentResultsService>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultUpdateHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultUpdateHandler>(ExperimentResultUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should update experiment result', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userID = 0;
    const command = new ExperimentResultUpdateCommand(experimentResult, userID);

    await handler.execute(command);

    expect(service.update).toBeCalledWith(experimentResult, userID);
    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasUpdatedEvent(experimentResult));
  });

  it('negative - should throw exception when experiment result not found', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const userID = 0;
    const command = new ExperimentResultUpdateCommand(experimentResult, userID);

    service.update.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundException(experimentResult.id);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultIdNotFoundException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundException) {
        expect(e.experimentResultID).toBe(experimentResult.id);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when experiment result is not valid', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const userID = 0;
    const errors: ValidationErrors = [];
    const command = new ExperimentResultUpdateCommand(experimentResult, userID);

    service.update.mockImplementation(() => {
      throw new ExperimentResultNotValidException(experimentResult, errors);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultNotValidException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultNotValidException) {
        expect(e.experimentResult).toBe(experimentResult);
        expect(e.errors).toEqual(errors);
        expect(eventBus.publish).not.toBeCalled();
        expect(commandBus.execute).toBeCalledWith(new ExperimentResultValidateCommand(experimentResult));
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userID = 0;
    const command = new ExperimentResultUpdateCommand(experimentResult, userID);

    service.update.mockImplementation(() => {
      throw new QueryFailedError('query', [], '');
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotCreatedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotUpdatedException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    } finally {
      expect(eventBus.publish).not.toBeCalled();
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userID = 0;
    const command = new ExperimentResultUpdateCommand(experimentResult, userID);

    service.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotCreatedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotUpdatedException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    } finally {
      expect(eventBus.publish).not.toBeCalled();
    }
  });
});
