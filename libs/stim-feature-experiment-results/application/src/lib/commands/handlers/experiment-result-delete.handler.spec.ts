import { QueryFailedError } from 'typeorm';

import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultWasNotDeletedException } from '@neuro-server/stim-feature-experiment-results/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultWasDeletedEvent } from '../../event/impl/experiment-result-was-deleted.event';
import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultDeleteCommand } from '../impl/experiment-result-delete.command';

import { ExperimentResultDeleteHandler } from './experiment-result-delete.handler';

describe('ExperimentResultDeleteHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultDeleteHandler;
  let service: MockType<ExperimentResultsService>;
  let eventBusMock: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultDeleteHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },

        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultDeleteHandler>(ExperimentResultDeleteHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should delete experiment result data file', async () => {
    const userGroups = [1];
    const experimentResultID = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = experimentResultID;
    const command = new ExperimentResultDeleteCommand(userGroups, experimentResultID);

    service.byId.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(service.delete).toBeCalledWith(experimentResultID);
    expect(eventBusMock.publish).toBeCalledWith(new ExperimentResultWasDeletedEvent(experimentResult));
  });

  it('negative - should throw exception when query failed', () => {
    const userGroups = [1];
    const experimentResultID = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = experimentResultID;
    const command = new ExperimentResultDeleteCommand(userGroups, experimentResultID);

    service.byId.mockImplementationOnce(() => {
      throw new QueryFailedError('', [], 'null');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultWasNotDeletedException(experimentResultID));
  });
});
