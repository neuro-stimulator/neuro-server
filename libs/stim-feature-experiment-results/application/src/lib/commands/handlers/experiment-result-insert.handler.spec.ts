import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultWasNotCreatedException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentResultWasCreatedEvent } from '../../event/impl/experiment-result-was-created.event';
import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultInsertCommand } from '../impl/experiment-result-insert.command';
import { ExperimentResultInsertHandler } from './experiment-result-insert.handler';

describe('ExperimentResultInsertHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultInsertHandler;
  let service: MockType<ExperimentResultsService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultInsertHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultInsertHandler>(ExperimentResultInsertHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    eventBus.publish.mockClear();
  });

  it('positive - should insert experiment result to database', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const command = new ExperimentResultInsertCommand(experimentResult);

    service.insert.mockReturnValue(experimentResult.id);

    await handler.execute(command);

    expect(service.insert).toBeCalled();
    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasCreatedEvent(experimentResult.id));
  });

  it('negative - insert query failed <- index violation usualy', async (done: DoneCallback) => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const command = new ExperimentResultInsertCommand(experimentResult);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('query', [], '');
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotCreatedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotCreatedException) {
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
    const command = new ExperimentResultInsertCommand(experimentResult);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotCreatedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotCreatedException) {
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    } finally {
      expect(eventBus.publish).not.toBeCalled();
    }
  });
});
