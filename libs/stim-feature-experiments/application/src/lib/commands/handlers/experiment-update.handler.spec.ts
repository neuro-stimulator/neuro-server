import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { ValidationErrors } from '@neuro-server/stim-lib-common';
import { ExperimentIdNotFoundException, ExperimentNotValidException, ExperimentWasNotUpdatedException } from '@neuro-server/stim-feature-experiments/domain';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
    testingModule.useLogger(new NoOpLogger());

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
    const userGroups = [1];
    const command = new ExperimentUpdateCommand(userGroups, experiment);

    commandBus.execute.mockReturnValue(true);
    service.update.mockReturnValueOnce(true);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new ExperimentValidateCommand(experiment));
    expect(service.update).toBeCalledWith(userGroups, experiment);
    expect(eventBus.publish).toBeCalledWith(new ExperimentWasUpdatedEvent(experiment));
  });

  it('positive - should not update non-changed experiment', async () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userGroups = [1];
    const command = new ExperimentUpdateCommand(userGroups, experiment);

    commandBus.execute.mockReturnValue(true);
    service.update.mockReturnValueOnce(false);

    await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new ExperimentValidateCommand(experiment));
    expect(service.update).toBeCalledWith(userGroups, experiment);
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should throw exception when experiment not found', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userGroups = [1];
    const command = new ExperimentUpdateCommand(userGroups, experiment);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experiment.id);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentIdNotFoundException(experiment.id));
  });

  it('negative - should throw exception when experiment is not valid', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userGroups = [1];
    const errors: ValidationErrors = [];
    const command = new ExperimentUpdateCommand(userGroups, experiment);

    commandBus.execute.mockImplementation(() => {
      throw new ExperimentNotValidException(experiment, errors);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentNotValidException(experiment, []));
  });

  it('negative - should throw exception when command failed', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userGroups = [1];
    const command = new ExperimentUpdateCommand(userGroups, experiment);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentWasNotUpdatedException(experiment));
  });

  it('negative - should throw exception when unknown error', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userGroups = [1];
    const command = new ExperimentUpdateCommand(userGroups, experiment);

    commandBus.execute.mockReturnValue(true);
    service.update.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentWasNotUpdatedException(experiment));
  });
});
