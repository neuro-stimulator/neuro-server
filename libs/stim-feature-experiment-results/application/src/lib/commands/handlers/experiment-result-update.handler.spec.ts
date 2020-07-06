import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentResultIdNotFoundError } from '@diplomka-backend/stim-feature-experiment-results/domain';
import { ExperimentResultWasNotUpdatedError } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { ExperimentResultWasUpdatedEvent } from '../../event/impl/experiment-result-was-updated.event';
import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultUpdateCommand } from '../impl/experiment-result-update.command';
import { ExperimentResultUpdateHandler } from './experiment-result-update.handler';

describe('ExperimentResultUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultUpdateHandler;
  let service: MockType<ExperimentResultsService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultUpdateHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultUpdateHandler>(ExperimentResultUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.pushResultData.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should update experiment result', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultUpdateCommand(experimentResult);

    await handler.execute(command);

    expect(service.update).toBeCalledWith(experimentResult);
    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasUpdatedEvent(experimentResult));
  });

  it('negative - should not update non existing experiment result', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const command = new ExperimentResultUpdateCommand(experimentResult);

    service.update.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundError(experimentResult.id);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultIdNotFoundError was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultIdNotFoundError) {
        expect(e.experimentResultID).toBe(experimentResult.id);
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - update query failed <- index violation usualy', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultUpdateCommand(experimentResult);

    service.update.mockImplementation(() => {
      throw new QueryFailedError('query', [], null);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotCreatedError was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotUpdatedError) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    } finally {
      expect(eventBus.publish).not.toBeCalled();
    }
  });

  it('negative - unknown exception', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultUpdateCommand(experimentResult);

    service.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotCreatedError was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotUpdatedError) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    } finally {
      expect(eventBus.publish).not.toBeCalled();
    }
  });
});
