import { QueryFailedError } from 'typeorm';
import DoneCallback = jest.DoneCallback;
import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { MockType } from 'test-helpers/test-helpers';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultDeleteHandler } from './experiment-result-delete.handler';
import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';
import { ExperimentResultDeleteCommand, ExperimentResultWasDeletedEvent } from '@diplomka-backend/stim-feature-experiment-results/application';
import { ExperimentResultWasNotDeletedError } from '@diplomka-backend/stim-feature-experiment-results/domain';

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
      ],
    }).compile();

    handler = testingModule.get<ExperimentResultDeleteHandler>(ExperimentResultDeleteHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    eventBusMock = testingModule.get<MockType<EventBus>>(EventBus);
  });

  it('positive - should delete experiment result data file', async () => {
    const experimentResultID = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = experimentResultID;
    const command = new ExperimentResultDeleteCommand(experimentResultID);

    service.byId.mockReturnValue(experimentResult);

    await handler.execute(command);

    expect(eventBusMock.publish).toBeCalledWith(new ExperimentResultWasDeletedEvent(experimentResult));
  });

  it('negative - should throw exception when query failed', async (done: DoneCallback) => {
    const experimentResultID = 1;
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = experimentResultID;
    const command = new ExperimentResultDeleteCommand(experimentResultID);

    service.byId.mockImplementationOnce(() => {
      throw new QueryFailedError('', undefined, null);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotDeletedError was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentResultWasNotDeletedError) {
        expect(eventBusMock.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
