import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, EventBus } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { EXPERIMENT_INSERT_GROUP, ExperimentNotValidException, ExperimentWasNotCreatedException } from '@diplomka-backend/stim-feature-experiments/domain';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentWasCreatedEvent } from '../../event/impl/experiment-was-created.event';
import { ExperimentsService } from '../../services/experiments.service';
import { createExperimentsServiceMock } from '../../services/experiments.service.jest';
import { ExperimentInsertCommand } from '../impl/experiment-insert.command';
import { ExperimentInsertHandler } from './experiment-insert.handler';
import { ExperimentValidateCommand } from '../impl/experiment-validate.command';

describe('ExperimentInsertHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentInsertHandler;
  let service: MockType<ExperimentsService>;
  let commandBus: MockType<CommandBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentInsertHandler,
        {
          provide: ExperimentsService,
          useFactory: createExperimentsServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentInsertHandler>(ExperimentInsertHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentsService>>(ExperimentsService);
    // @ts-ignore
    commandBus = testingModule.get<MockType<CommandBus>>(CommandBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    service.insert.mockClear();
    commandBus.execute.mockClear();
    eventBus.publish.mockClear();
  });

  it('positive - should insert experiment', async () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentInsertCommand(experiment, userID);

    service.insert.mockReturnValue(experiment.id);

    const result = await handler.execute(command);

    expect(commandBus.execute).toBeCalledWith(new ExperimentValidateCommand(experiment, [EXPERIMENT_INSERT_GROUP]));
    expect(result).toEqual(experiment.id);
    expect(service.insert).toBeCalledWith(experiment, userID);
    expect(eventBus.publish).toBeCalledWith(new ExperimentWasCreatedEvent(experiment.id));
  });

  it('negative - should throw exception when experiment not found', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentInsertCommand(experiment, userID);

    service.insert.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentWasNotCreatedException(experiment));
  });

  it('negative - should throw exception when experiment not valid', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const errors: ValidationErrors = [];
    const command = new ExperimentInsertCommand(experiment, userID);

    service.insert.mockImplementation(() => {
      throw new ExperimentNotValidException(experiment, errors);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentNotValidException(experiment, []));
  });

  it('negative - should throw exception when unknown error', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userID = 0;
    const command = new ExperimentInsertCommand(experiment, userID);

    service.insert.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentWasNotCreatedException(experiment));
  });
});
