import { QueryFailedError } from 'typeorm';
import DoneCallback = jest.DoneCallback;
import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultWasNotDeletedException } from '@diplomka-backend/stim-feature-experiment-results/domain';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultWasDeletedEvent } from '../../event/impl/experiment-result-was-deleted.event';
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
    const experimentResultID = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = experimentResultID;
    const userID = 0;
    const command = new ExperimentResultDeleteCommand(experimentResultID, userID);

    service.byId.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(service.delete).toBeCalledWith(experimentResultID, userID);
    expect(eventBusMock.publish).toBeCalledWith(new ExperimentResultWasDeletedEvent(experimentResult));
  });

  it('negative - should throw exception when query failed', async (done: DoneCallback) => {
    const experimentResultID = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = experimentResultID;
    const userID = 0;
    const command = new ExperimentResultDeleteCommand(experimentResultID, userID);

    service.byId.mockImplementationOnce(() => {
      throw new QueryFailedError('', [], 'null');
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotDeletedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotDeletedException) {
        expect(eventBusMock.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
