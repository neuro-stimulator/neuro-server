import { QueryFailedError } from 'typeorm';

import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, createEmptyExperimentResult, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentResultIdNotFoundException, ExperimentResultNotValidException, ExperimentResultWasNotUpdatedException } from '@neuro-server/stim-feature-experiment-results/domain';
import { ValidationErrors } from '@neuro-server/stim-lib-common';

import { commandBusProvider, eventBusProvider, MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentResultWasUpdatedEvent } from '../../event/impl/experiment-result-was-updated.event';
import { ExperimentResultsService } from '../../services/experiment-results.service';
import { createExperimentResultsServiceMock } from '../../services/experiment-results.service.jest';
import { ExperimentResultUpdateCommand } from '../impl/experiment-result-update.command';

import { ExperimentResultUpdateHandler } from './experiment-result-update.handler';

describe('ExperimentResultUpdateHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentResultUpdateHandler;
  let service: MockType<ExperimentResultsService>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultUpdateHandler,
        {
          provide: ExperimentResultsService,
          useFactory: createExperimentResultsServiceMock,
        },
        commandBusProvider,
        eventBusProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentResultUpdateHandler>(ExperimentResultUpdateHandler);
    // @ts-ignore
    service = testingModule.get<MockType<ExperimentResultsService>>(ExperimentResultsService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should update experiment result', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userGroups = [1];
    const command = new ExperimentResultUpdateCommand(userGroups, experimentResult);

    service.update.mockReturnValueOnce(true);

    await handler.execute(command);

    expect(service.update).toBeCalledWith(userGroups, experimentResult);
    expect(eventBus.publish).toBeCalledWith(new ExperimentResultWasUpdatedEvent(experimentResult));
  });

  it('positive - should not update non-changed experiment result', async () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userGroups = [1];
    const command = new ExperimentResultUpdateCommand(userGroups, experimentResult);

    service.update.mockReturnValueOnce(false);

    await handler.execute(command);

    expect(service.update).toBeCalledWith(userGroups, experimentResult);
    expect(eventBus.publish).not.toBeCalled();
  });

  it('negative - should throw exception when experiment result not found', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const userGroups = [1];
    const command = new ExperimentResultUpdateCommand(userGroups, experimentResult);

    service.update.mockImplementation(() => {
      throw new ExperimentResultIdNotFoundException(experimentResult.id);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultIdNotFoundException(experimentResult.id));
  });

  it('negative - should throw exception when experiment result is not valid', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    experimentResult.id = 1;
    const userGroups = [1];
    const errors: ValidationErrors = [];
    const command = new ExperimentResultUpdateCommand(userGroups, experimentResult);

    service.update.mockImplementation(() => {
      throw new ExperimentResultNotValidException(experimentResult, errors);
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultNotValidException(experimentResult, errors));
  });

  it('negative - should throw exception when command failed', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userGroups = [1];
    const command = new ExperimentResultUpdateCommand(userGroups, experimentResult);

    service.update.mockImplementation(() => {
      throw new QueryFailedError('query', [], '');
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultWasNotUpdatedException(experimentResult));
  });

  it('negative - should throw exception when unknown error', () => {
    const experimentResult: ExperimentResult = createEmptyExperimentResult(createEmptyExperiment());
    const userGroups = [1];
    const command = new ExperimentResultUpdateCommand(userGroups, experimentResult);

    service.update.mockImplementation(() => {
      throw new Error();
    });

    expect(() => handler.execute(command)).rejects.toThrow(new ExperimentResultWasNotUpdatedException(experimentResult));
  });
});
