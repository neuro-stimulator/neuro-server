import { QueryFailedError } from 'typeorm';

import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultWasNotCreatedException } from '@neuro-server/stim-feature-experiment-results/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
    testingModule.useLogger(new NoOpLogger());

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
    const userID = 0;
    const command = new ExperimentResultInsertCommand(experimentResult, userID);

    service.insert.mockReturnValue(experimentResult.id);

    await handler.execute(command);

    expect(service.insert).toBeCalledWith(experimentResult, userID);
    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasCreatedEvent(experimentResult.id));
  });

  it('negative - insert query failed <- index violation usualy', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userID = 0;
    const command = new ExperimentResultInsertCommand(experimentResult, userID);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('query', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultWasNotCreatedException(experimentResult));
  });

  it('negative - unknown exception', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userID = 0;
    const command = new ExperimentResultInsertCommand(experimentResult, userID);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultWasNotCreatedException(experimentResult));
  });
});
