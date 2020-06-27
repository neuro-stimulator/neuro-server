import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { ExperimentIdNotFoundError, ExperimentWasDeletedEvent, ExperimentWasNotDeletedError } from '@diplomka-backend/stim-feature-experiments';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { createExperimentsServiceMock } from '../../../domain/services/experiments.service.jest';
import { ExperimentDeleteCommand } from '../impl/experiment-delete.command';
import { ExperimentDeleteHandler } from './experiment-delete.handler';

describe('ExperimentDeleteHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentDeleteHandler;
  let service: MockType<ExperimentsService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentDeleteHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentDeleteHandler>(ExperimentDeleteHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.delete.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should delete experiment', async () => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    const command = new ExperimentDeleteCommand(experiment.id);

    service.byId.mockReturnValue(experiment);

    await handler.execute(command);

    expect(service.delete).toBeCalledWith(experiment.id);
    expect(eventBus.publish).toBeCalledWith(new ExperimentWasDeletedEvent(experiment));
  });

  it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
    const experimentID = -1;
    const command = new ExperimentDeleteCommand(experimentID);

    service.byId.mockImplementation(() => {
      throw new ExperimentIdNotFoundError(experimentID);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentIdNotFoundError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundError) {
        expect(e.experimentID).toEqual(experimentID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const experimentID = -1;
    const command = new ExperimentDeleteCommand(experimentID);

    service.byId.mockImplementation(() => {
      throw new QueryFailedError('command', [], null);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentResultWasNotDeletedError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentWasNotDeletedError) {
        expect(e.experimentID).toEqual(experimentID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const experimentID = -1;
    const command = new ExperimentDeleteCommand(experimentID);

    service.byId.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentResultWasNotDeletedError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentWasNotDeletedError) {
        expect(e.experimentID).toEqual(experimentID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
