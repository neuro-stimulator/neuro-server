import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptySequence, Experiment, ExperimentAssets, MessageCodes, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException, ValidationErrors } from '@diplomka-backend/stim-lib-common';
import {
  ExperimentNotValidException,
  ExperimentIdNotFoundException,
  ExperimentWasNotCreatedException,
  ExperimentWasNotUpdatedException,
  ExperimentWasNotDeletedException,
} from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentDoNotSupportSequencesException, SequenceIdNotFoundException, SequenceWasNotCreatedException } from '@diplomka-backend/stim-feature-sequences/domain';

import { createExperimentsFacadeMock } from '../service/experiments.facade.jest';
import { ExperimentsFacade } from '../service/experiments.facade';
import { ExperimentsController } from './experiments.controller';
import { IpcOutputSynchronizationExperimentIdMissingException, NoIpcOpenException } from '@diplomka-backend/stim-feature-ipc/domain';

describe('Experiments controller', () => {
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
    controller = testingModule.get(ExperimentsController);
    // @ts-ignore
    mockExperimentsFacade = testingModule.get<MockType<ExperimentsFacade>>(ExperimentsFacade);
  });

  afterEach(() => {
    mockExperimentsFacade.experimentsAll.mockClear();
    mockExperimentsFacade.filteredExperiments.mockClear();
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

      const result: ResponseObject<Experiment<Output>[]> = await controller.all();
      const expected: ResponseObject<Experiment<Output>[]> = { data: experiments };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', async (done: DoneCallback) => {
      mockExperimentsFacade.experimentsAll.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .all()
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
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
      const userID = 0;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.experimentById({ id: experiment.id }, userID);
      const expected: ResponseObject<Experiment<Output>> = { data: experiment };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;

      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      controller
        .experimentById({ id: experimentID }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experimentID });
          done();
        });
    });

    it('negative - should throw an exception when unknown error', async (done: DoneCallback) => {
      const userID = 0;

      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new Error();
      });

      controller
        .experimentById({ id: 1 }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
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

      const result: ResponseObject<Sequence> = await controller.sequenceFromExperiment({ id: experimentID, name, size }, userID);
      const expected: ResponseObject<Sequence> = { data: sequence };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experimentID });
          done();
        });
    });

    it('negative - should throw an exception when experiment do not support sequences', async (done: DoneCallback) => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesException(experimentID);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES);
          expect(exception.params).toEqual({ id: experimentID });
          done();
        });
    });

    it('negative - should throw an exception when sequence not found', async (done: DoneCallback) => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new SequenceIdNotFoundException(sequence.id);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND);
          expect(exception.params).toEqual({ id: sequence.id });
          done();
        });
    });

    it('negative - should throw an exception when sequence was not created', async (done: DoneCallback) => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new SequenceWasNotCreatedException(sequence);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_CREATED);
          expect(exception.params).toEqual({ sequence: sequence });
          done();
        });
    });

    it('negative - should throw an exception when unknown error occured', async (done: DoneCallback) => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('sequencesForExperiment()', () => {
    it('positive - should find all sequences for experiment', async () => {
      const expeirmentID = 1;
      const sequences: Sequence[] = [];
      const userID = 0;

      mockExperimentsFacade.sequencesForExperiment.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.sequencesForExperiment({ id: expeirmentID }, userID);
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const experimentID = 1;
      const userID = 0;

      mockExperimentsFacade.sequencesForExperiment.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.sequencesForExperiment({ id: experimentID }, userID);
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      mockExperimentsFacade.insert.mockReturnValue(1);
      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.insert(experiment, userID);
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

    it('negative - should not insert invalid experiment', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;
      const errors: ValidationErrors = [];

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      await controller
        .insert(experiment, userID)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID);
          expect(exception.params).toEqual(errors);
          done();
        });
    });

    it('negative - should not insert when query error', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentWasNotCreatedException(experiment);
      });

      await controller
        .insert(experiment, userID)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_CREATED);
          done();
        });
    });

    it('negative - should not insert experiment when unknown error', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .insert(experiment, userID)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('update()', () => {
    it('positive - should update experiment', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const userID = 0;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.update(experiment, userID);
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

    it('negative - should not update experiment which is not found', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const userID = 0;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experiment.id);
      });

      await controller
        .update(experiment, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });

    it('negative - should not update experiment because of problem with update', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const userID = 0;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentWasNotUpdatedException(experiment);
      });

      await controller
        .update(experiment, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_UPDATED);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });

    it('negative - should not update experiment when unknown error', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const userID = 0;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .update(experiment, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not update invalid experiment', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;
      const errors: ValidationErrors = [];

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      await controller
        .update(experiment, userID)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID);
          expect(exception.params).toEqual(errors);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('positive - should delete experiment', async () => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      const userID = 0;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment<Output>> = await controller.delete(
        {
          id: 1,
        },
        userID
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

    it('negative - should not delete experiment which is not found', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const userID = 0;

      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experiment.id);
      });

      await controller
        .delete({ id: experiment.id }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });

    it('negative - should not delete experiment when unknown error', async (done: DoneCallback) => {
      const id = 1;
      const userID = 0;

      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .delete({ id }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not delete experiment because of problem with delete', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const userID = 0;

      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentWasNotDeletedException(experiment.id);
      });

      await controller
        .delete({ id: experiment.id }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_DELETED);
          expect(exception.params).toEqual({ id: experiment.id });
          done();
        });
    });
  });

  describe('usedOutputMultimedia()', () => {
    it('positive - should return used output multimedia for experiment', async () => {
      const multimedia: ExperimentAssets = { audio: {}, image: {} };
      const userID = 0;

      mockExperimentsFacade.usedOutputMultimedia.mockReturnValue(multimedia);

      const result: ResponseObject<ExperimentAssets> = await controller.usedOutputMultimedia({ id: 1 }, userID);
      const expected: ResponseObject<ExperimentAssets> = {
        data: multimedia,
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not return any output multimedia for experiment which is not found', async (done: DoneCallback) => {
      const userID = 0;

      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(1);
      });

      await controller
        .usedOutputMultimedia({ id: 1 }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(exception.params).toEqual({ id: 1 });
          done();
        });
    });

    it('negative - should not return any output multimedia for experiment when unknown error', async (done: DoneCallback) => {
      const userID = 0;

      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .usedOutputMultimedia({ id: 1 }, userID)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
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

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const experiment: Experiment<Output> = createEmptyExperiment();

      mockExperimentsFacade.validate.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .validate(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('setOutputSynchronization()', () => {
    it('positive - should stop ipc server', async () => {
      const synchronize = false;
      const userID = 1;
      const result: ResponseObject<void> = await controller.setOutputSynchronization(userID, synchronize);
      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_SUCCESS } };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when server already stop', async (done: DoneCallback) => {
      const synchronize = false;
      const userID = 1;

      mockExperimentsFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new NoIpcOpenException();
      });

      await controller
        .setOutputSynchronization(userID, synchronize)
        .then(() => done.fail())
        .catch((exception: NoIpcOpenException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_NOT_OPEN);
          done();
        });
    });

    it('negative - should throw an exception when experiment id is missing', async (done: DoneCallback) => {
      const synchronize = false;
      const userID = undefined;

      mockExperimentsFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new IpcOutputSynchronizationExperimentIdMissingException();
      });

      await controller
        .setOutputSynchronization(userID, synchronize)
        .then(() => done.fail())
        .catch((exception: IpcOutputSynchronizationExperimentIdMissingException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_IPC_SYNC_EXPERIMENT_ID_MISSING);
          done();
        });
    });

    it('negative - should throw an exception when unexpected error occured', async (done: DoneCallback) => {
      const synchronize = false;
      const userID = 1;

      mockExperimentsFacade.setOutputSynchronization.mockImplementationOnce(() => {
        throw new Error();
      });

      await controller
        .setOutputSynchronization(userID, synchronize)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });
});
