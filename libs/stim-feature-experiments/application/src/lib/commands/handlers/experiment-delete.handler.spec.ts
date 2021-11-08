import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { createEmptyExperiment, Experiment, ExperimentType, Output } from '@stechy1/diplomka-share';

import { eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentIdNotFoundException, ExperimentWasNotDeletedException } from '@neuro-server/stim-feature-experiments/domain';

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
    testingModule.useLogger(new NoOpLogger());

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
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    experiment.type = ExperimentType.NONE;
    const userGroups = [1];
    const command = new ExperimentDeleteCommand(userGroups, experiment.id);

    service.byId.mockReturnValue(experiment);

    await handler.execute(command);

    expect(service.delete).toBeCalledWith(...[...userGroups, experiment.type]);
    expect(eventBus.publish).toBeCalledWith(new ExperimentWasDeletedEvent(experiment));
  });

  it('negative - should throw exception when experiment not found', () => {
    const experimentID = -1;
    const userGroups = [1];
    const command = new ExperimentDeleteCommand(userGroups, experimentID);

    service.byId.mockImplementation(() => {
      throw new ExperimentIdNotFoundException(experimentID);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentIdNotFoundException(experimentID));
  });

  it('negative - should throw exception when command failed', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.id = 1;
    const userGroups = [1];
    const command = new ExperimentDeleteCommand(userGroups, experiment.id);

    service.byId.mockReturnValue(experiment);
    service.delete.mockImplementation(() => {
      throw new QueryFailedError('command', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentWasNotDeletedException(experiment.id));
  });

  it('negative - should throw exception when unknown error', () => {
    const experimentID = -1;
    const userGroups = [1];
    const command = new ExperimentDeleteCommand(userGroups, experimentID);

    service.byId.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentWasNotDeletedException(experimentID));
  });
});
