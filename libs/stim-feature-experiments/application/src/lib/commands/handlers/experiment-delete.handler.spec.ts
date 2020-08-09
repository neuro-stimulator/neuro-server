import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentWasNotDeletedException } from '@diplomka-backend/stim-feature-experiments/domain';

import { ExperimentWasDeletedEvent } from '../../event/impl/experiment-was-deleted.event';
import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
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
    jest.clearAllMocks();
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
      throw new ExperimentIdNotFoundException(experimentID);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        expect(e.experimentID).toEqual(experimentID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    const command = new ExperimentDeleteCommand(experiment.id);

    service.byId.mockReturnValue(experiment);
    service.delete.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentResultWasNotDeletedException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentWasNotDeletedException) {
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
      done.fail({ message: 'ExperimentResultWasNotDeletedException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentWasNotDeletedException) {
        expect(e.experimentID).toEqual(experimentID);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
