import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import DoneCallback = jest.DoneCallback;

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { commandBusProvider, eventBusProvider, MockType } from 'test-helpers/test-helpers';

import { ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentWasNotUpdatedException } from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentNotValidException } from '@diplomka-backend/stim-feature-experiments/domain';

import { ExperimentWasUpdatedEvent } from '../../event/impl/experiment-was-updated.event';
import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
import { ExperimentUpdateCommand } from '../impl/experiment-update.command';
import { ExperimentValidateCommand } from '../impl/experiment-validate.command';
import { ExperimentUpdateHandler } from './experiment-update.handler';

describe('ExperimentUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentUpdateHandler;
  let service: MockType<ExperimentsService>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentUpdateHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
        eventBusProvider,
        commandBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentUpdateHandler>(ExperimentUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.update.mockClear();
    commandBus.execute.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should update experiment', async () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentUpdateCommand(experiment, userID);

    commandBus.execute.mockReturnValue(true);
    service.byId.mockReturnValue(experiment);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new ExperimentValidateCommand(experiment));
    expect(service.update).toBeCalledWith(experiment, userID);
    expect(eventBus.publish).toBeCalledWith(new ExperimentWasUpdatedEvent(experiment));
  });

  it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentUpdateCommand(experiment, userID);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experiment.id);
    });

    try {
      await handler.execute(command);
      done.fail({ message: 'ExperimentIdNotFoundException was not thrown' });
    } catch (e) {
      if (e instanceof ExperimentIdNotFoundException) {
        expect(e.experimentID).toEqual(experiment.id);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown.');
      }
    }
  });

  it('negative - should throw exception when experiment is not valid', async (done: DoneCallback) => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const errors: ValidationErrors = [];
    const command = new ExperimentUpdateCommand(experiment, userID);

    commandBus.execute.mockImplementation(() => {
      throw new ExperimentNotValidException(experiment, errors);
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentNotValidException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentNotValidException) {
        expect(e.experiment).toEqual(experiment);
        expect(e.errors).toEqual(errors);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when command failed', async (done: DoneCallback) => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentUpdateCommand(experiment, userID);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotUpdatedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentWasNotUpdatedException) {
        expect(e.experiment).toEqual(experiment);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });

  it('negative - should throw exception when unknown error', async (done: DoneCallback) => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentUpdateCommand(experiment, userID);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
      done.fail('ExperimentResultWasNotUpdatedException was not thrown!');
    } catch (e) {
      if (e instanceof ExperimentWasNotUpdatedException) {
        expect(e.experiment).toEqual(experiment);
        expect(eventBus.publish).not.toBeCalled();
        done();
      } else {
        done.fail('Unknown exception was thrown!');
      }
    }
  });
});
