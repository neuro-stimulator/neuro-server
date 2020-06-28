import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment } from '@stechy1/diplomka-share';

import { eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ExperimentsService } from '../../../domain/services/experiments.service';
import { createExperimentsServiceMock } from '../../../domain/services/experiments.service.jest';
import { ExperimentWasNotCreatedError } from '../../../domain/exception/experiment-was-not-created.error';
import { ExperimentWasCreatedEvent } from '../../event/impl/experiment-was-created.event';
import { ExperimentInsertCommand } from '../impl/experiment-insert.command';
import { ExperimentInsertHandler } from './experiment-insert.handler';

describe('ExperimentInsertHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentInsertHandler;
  let service: MockType<ExperimentsService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentInsertHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentInsertHandler>(ExperimentInsertHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.insert.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should insert experiment', async () => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    const command = new ExperimentInsertCommand(experiment);

    service.insert.mockReturnValue(experiment.id);

    const result = await handler.execute(command);

    expect(result).toEqual(experiment.id);
    expect(service.insert).toBeCalledWith(experiment);
    expect(eventBus.publish).toBeCalledWith(new ExperimentWasCreatedEvent(experiment.id));
  });

  it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    const command = new ExperimentInsertCommand(experiment);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('command', [], null);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentWasNotCreatedError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentWasNotCreatedError) {
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const experiment: Experiment = createEmptyExperiment();
    experiment.id = 1;
    const command = new ExperimentInsertCommand(experiment);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentWasNotCreatedError was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentWasNotCreatedError) {
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });
});
