import { Test, TestingModule } from '@nestjs/testing';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptySequence, Experiment, ExperimentAssets, MessageCodes, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException, ExperimentDtoNotFoundException, QueryError, ValidationErrors } from '@diplomka-backend/stim-lib-common';
import {
  ExperimentNotValidException,
  ExperimentIdNotFoundException,
  ExperimentWasNotCreatedException,
  ExperimentWasNotUpdatedException,
  ExperimentWasNotDeletedException,
} from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentDoNotSupportSequencesException, SequenceIdNotFoundException, SequenceWasNotCreatedException } from '@diplomka-backend/stim-feature-sequences/domain';
import { IpcOutputSynchronizationExperimentIdMissingException, NoIpcOpenException } from '@diplomka-backend/stim-feature-ipc/domain';

import { createExperimentsFacadeMock } from '../service/experiments.facade.jest';
import { ExperimentsFacade } from '../service/experiments.facade';
import { ExperimentsController } from './experiments.controller';

describe('Experiments controller', () => {
  const userGroups: number[] = [1];

  let testingModule: TestingModule;
  let controller: ExperimentsController;
  let mockExperimentsFacade: MockType<ExperimentsFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ExperimentsController],
      providers: [
        {
          provide: ExperimentsFacade,
          useFactory: createExperimentsFacadeMock,
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());
    controller = testingModule.get(ExperimentsController);
    // @ts-ignore
    mockExperimentsFacade = testingModule.get<MockType<ExperimentsFacade>>(ExperimentsFacade);
  });

  afterEach(() => {
    mockExperimentsFacade.experimentsAll.mockClear();
    mockExperimentsFacade.experimentByID.mockClear();
    mockExperimentsFacade.validate.mockClear();
    mockExperimentsFacade.insert.mockClear();
    mockExperimentsFacade.update.mockClear();
    mockExperimentsFacade.delete.mockClear();
    mockExperimentsFacade.usedOutputMultimedia.mockClear();
    mockExperimentsFacade.nameExists.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all experiments', async () => {
      const experiments = new Array(5).fill(0).map(() => createEmptyExperiment());

      mockExperimentsFacade.experimentsAll.mockReturnValue(experiments);

      const result: ResponseObject<Experiment<Output>[]> = await controller.all(userGroups);
      const expected: ResponseObject<Experiment<Output>[]> = { data: experiments };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', () => {
      mockExperimentsFacade.experimentsAll.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.all(userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('nameExists()', () => {
    it('positive - should check name existence of an experiment', async () => {
      mockExperimentsFacade.nameExists.mockReturnValue(false);

      const result: ResponseObject<{
        exists: boolean;
      }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: false },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should check name existence of an experiment', async () => {
      mockExperimentsFacade.nameExists.mockReturnValue(true);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: true },
      };

      expect(result).toEqual(expected);
    });
  });

  describe('experimentById()', () => {
    it('positive - should find experiment by id', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.experimentById({ id: experiment.id }, userGroups);
      const expected: ResponseObject<Experiment<Output>> = { data: experiment };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', () => {
      const experimentID = 1;

      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      expect(() => controller.experimentById({ id: experimentID }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: experimentID }));
    });

    it('negative - should throw an exception when unknown error', () => {

      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.experimentById({ id: 1 }, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('sequenceFromExperiment()', () => {
    it('positive - should create new sequence from experiment', async () => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockReturnValue(sequence.id);
      mockExperimentsFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.sequenceFromExperiment({ id: experimentID, name, size }, userID, userGroups);
      const expected: ResponseObject<Sequence> = { data: sequence };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', () => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      expect(() => controller.sequenceFromExperiment({ id: experimentID, name, size }, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: experimentID }));
    });

    it('negative - should throw an exception when experiment do not support sequences', () => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesException(experimentID);
      });

      expect(() => controller.sequenceFromExperiment({ id: experimentID, name, size }, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES, { id: experimentID }));
    });

    it('negative - should throw an exception when sequence not found', () => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new SequenceIdNotFoundException(sequence.id);
      });

      expect(() => controller.sequenceFromExperiment({ id: experimentID, name, size }, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, { id: sequence.id }));
    });

    it('negative - should throw an exception when sequence was not created', () => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new SequenceWasNotCreatedException(sequence);
      });

      expect(() => controller.sequenceFromExperiment({ id: experimentID, name, size }, userID, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_CREATED, { sequence: sequence }));
    });

    it('negative - should throw an exception when unknown error occured', () => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.sequenceFromExperiment({ id: experimentID, name, size }, userID, userGroups))
      .rejects.toThrow(new ControllerException());
    });
  });

  describe('sequencesForExperiment()', () => {
    it('positive - should find all sequences for experiment', async () => {
      const expeirmentID = 1;
      const sequences: Sequence[] = [];

      mockExperimentsFacade.sequencesForExperiment.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.sequencesForExperiment({ id: expeirmentID }, userGroups);
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unknown error occured', () => {
      const experimentID = 1;

      mockExperimentsFacade.sequencesForExperiment.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.sequencesForExperiment({ id: experimentID }, userGroups))
      .rejects.toThrow(new ControllerException());
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      mockExperimentsFacade.insert.mockReturnValue(1);
      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.insert(experiment, userID, userGroups);
      const expected: ResponseObject<Experiment<Output>> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_CREATED,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not insert invalid experiment', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;
      const errors: ValidationErrors = [];

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      expect(() => controller.insert(experiment, userID, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID, { errors }));
    });

    it('negative - should not insert when query error', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const queryError: QueryError = {
        message: 'message',
        errno: 1,
        code: 'error code',
        query: 'SELECT * FROM experiment_entity',
        parameters: [],
      };
      const userID = 0;

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentWasNotCreatedException(experiment, queryError);
      });

      expect(() => controller.insert(experiment, userID, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_CREATED));
    });

    it('negative - should not insert when DTO of entity not found', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const dtoType = 'dtoType';
      const userID = 0;

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentDtoNotFoundException(dtoType);
      });

      expect(() => controller.insert(experiment, userID, userGroups)).rejects.toThrow(new ControllerException());
    });

    it('negative - should not insert experiment when unknown error', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.insert(experiment, userID, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('update()', () => {
    it('positive - should update experiment', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockReturnValue(true);
      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.update(experiment, userGroups);
      const expected: ResponseObject<Experiment<Output>> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATED,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('positive - should return same experiment because update is not necessary', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockReturnValue(false);
      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.update(experiment, userGroups);
      const expected: ResponseObject<Experiment<Output>> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_UPDATE_NOT_NECESSARY,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not update experiment which is not found', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experiment.id);
      });

      expect(() => controller.update(experiment, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: experiment.id }));
    });

    it('negative - should not update experiment because of problem with update', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentWasNotUpdatedException(experiment, { message: 'SQL failed' } as QueryError);
      });

      expect(() => controller.update(experiment, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_UPDATED, { id: experiment.id }));
    });

    it('negative - should not update experiment when unknown error', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.update(experiment, userGroups)).rejects.toThrow(new ControllerException());
    });

    it('negative - should not update invalid experiment', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const errors: ValidationErrors = [];

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      expect(() => controller.update(experiment, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID));
    });
  });

  describe('delete()', () => {
    it('positive - should delete experiment', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.delete(
        {
          id: 1,
        },
        userGroups
      );
      const expected: ResponseObject<Experiment<Output>> = {
        data: experiment,
        message: {
          code: MessageCodes.CODE_SUCCESS_EXPERIMENT_DELETED,
          params: {
            id: experiment.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not delete experiment which is not found', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experiment.id);
      });

      expect(
        () => controller.delete({ id: experiment.id }, userGroups))
      .rejects
      .toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: experiment.id }));
    });

    it('negative - should not delete experiment when unknown error', () => {
      const id = 1;

      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.delete({ id }, userGroups)).rejects.toThrow(new ControllerException());
    });

    it('negative - should not delete experiment because of problem with delete', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentWasNotDeletedException(experiment.id, { message: 'SQL failed' } as QueryError);
      });

      expect(() => controller.delete({ id: experiment.id }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_DELETED, { id: experiment.id }));
    });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should return used output multimedia for experiment', async () => {
      const multimedia: ExperimentAssets = { audio: {}, image: {} };
      const userID = 0;

      mockExperimentsFacade.usedOutputMultimedia.mockReturnValue(multimedia);

      const result: ResponseObject<ExperimentAssets> = await controller.usedOutputMultimedia({ id: 1 }, userID, userGroups);
      const expected: ResponseObject<ExperimentAssets> = {
        data: multimedia,
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not return any output multimedia for experiment which is not found', () => {
      const userID = 0;

      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(1);
      });

      expect(
        () => controller.usedOutputMultimedia({ id: 1 }, userID, userGroups))
      .rejects
      .toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: 1 }));
    });

    it('negative - should not return any output multimedia for experiment when unknown error', () => {
      const userID = 0;

      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.usedOutputMultimedia({ id: 1 }, userID, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('validate()', () => {
    it('positive - should return true when experiment is valid', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const valid = true;

      mockExperimentsFacade.validate.mockReturnValue(valid);

      const result: ResponseObject<boolean> = await controller.validate(experiment);
      const expected: ResponseObject<boolean> = { data: valid };

      expect(result).toEqual(expected);
    });

    it('negative - should return false when experiment is invalid', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const errors: ValidationErrors = [];
      const valid = false;

      mockExperimentsFacade.validate.mockImplementationOnce(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      const result: ResponseObject<boolean> = await controller.validate(experiment);
      const expected: ResponseObject<boolean> = { data: valid };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unknown error occured', () => {
      const experiment: Experiment<Output> = createEmptyExperiment();

      mockExperimentsFacade.validate.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.validate(experiment)).rejects.toThrow(new ControllerException());
    });
  });

  describe('setOutputSynchronization()', () => {
    it('positive - should stop ipc server', async () => {
      const synchronize = false;
      const result: ResponseObject<void> = await controller.setOutputSynchronization(userGroups, synchronize);
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already stop', () => {
      const synchronize = false;

      mockExperimentsFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      expect(() => controller.setOutputSynchronization(userGroups, synchronize)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_NOT_OPEN));
    });

    it('negative - should throw an exception when experiment id is missing', () => {
      const synchronize = false;
      const userID = undefined;

      mockExperimentsFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new IpcOutputSynchronizationExperimentIdMissingException();
      });

      expect(() => controller.setOutputSynchronization(userID, synchronize)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_IPC_SYNC_EXPERIMENT_ID_MISSING));
    });

    it('negative - should throw an exception when unexpected error occured', () => {
      const synchronize = false;

      mockExperimentsFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => controller.setOutputSynchronization(userGroups, synchronize)).rejects.toThrow(new ControllerException());
    });
  });
});
