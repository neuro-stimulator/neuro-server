import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { MockType } from 'test-helpers/test-helpers';

import { createEmptyExperiment, createEmptySequence, Experiment, MessageCodes, ResponseObject, Sequence } from '@stechy1/diplomka-share';

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

      const result: ResponseObject<Experiment[]> = await controller.all();
      const expected: ResponseObject<Experiment[]> = { data: experiments };

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
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.experimentById({ id: experiment.id });
      const expected: ResponseObject<Experiment> = { data: experiment };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = 1;

      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      controller
        .experimentById({ id: experimentID })
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
      mockExperimentsFacade.experimentByID.mockImplementation(() => {
        throw new Error();
      });

      controller
        .experimentById({ id: 1 })
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

      mockExperimentsFacade.sequenceFromExperiment.mockReturnValue(sequence.id);
      mockExperimentsFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.sequenceFromExperiment({ id: experimentID, name, size });
      const expected: ResponseObject<Sequence> = { data: sequence };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = 1;
      const name = 'name';
      const size = 10;
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size })
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

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesException(experimentID);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size })
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

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new SequenceIdNotFoundException(sequence.id);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size })
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

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new SequenceWasNotCreatedException(sequence);
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size })
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

      mockExperimentsFacade.sequenceFromExperiment.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .sequenceFromExperiment({ id: experimentID, name, size })
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

      mockExperimentsFacade.sequencesForExperiment.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.sequencesForExperiment({ id: expeirmentID });
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const experimentID = 1;

      mockExperimentsFacade.sequencesForExperiment.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.sequencesForExperiment({ id: experimentID });
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
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockReturnValue(1);
      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.insert(experiment);
      const expected: ResponseObject<Experiment> = {
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
      const experiment: Experiment = createEmptyExperiment();
      const errors: ValidationErrors = [];

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      await controller
        .insert(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID);
          expect(exception.params).toEqual(errors);
          done();
        });
    });

    it('negative - should not insert when query error', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new ExperimentWasNotCreatedException(experiment);
      });

      await controller
        .insert(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_CREATED);
          done();
        });
    });

    it('negative - should not insert experiment when unknown error', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.insert.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .insert(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('update()', () => {
    it('positive - should update experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.update(experiment);
      const expected: ResponseObject<Experiment> = {
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
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experiment.id);
      });

      await controller
        .update(experiment)
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
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentWasNotUpdatedException(experiment);
      });

      await controller
        .update(experiment)
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
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      mockExperimentsFacade.update.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .update(experiment)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not update invalid experiment', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      const errors: ValidationErrors = [];

      mockExperimentsFacade.update.mockImplementation(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      await controller
        .update(experiment)
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
      const experiment: Experiment = createEmptyExperiment();

      mockExperimentsFacade.experimentByID.mockReturnValue(experiment);

      const result: ResponseObject<Experiment> = await controller.delete({
        id: 1,
      });
      const expected: ResponseObject<Experiment> = {
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
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;

      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experiment.id);
      });

      await controller
        .delete({ id: experiment.id })
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
      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .delete({ id })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not delete experiment because of problem with delete', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      mockExperimentsFacade.validate.mockReturnValue(true);
      mockExperimentsFacade.delete.mockImplementation(() => {
        throw new ExperimentWasNotDeletedException(experiment.id);
      });

      await controller
        .delete({ id: experiment.id })
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
      const multimedia: { audio: {}; image: {} } = { audio: {}, image: {} };
      mockExperimentsFacade.usedOutputMultimedia.mockReturnValue(multimedia);

      const result: ResponseObject<{
        audio: {};
        image: {};
      }> = await controller.usedOutputMultimedia({ id: 1 });
      const expected: ResponseObject<{ audio: {}; image: {} }> = {
        data: multimedia,
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not return any output multimedia for experiment which is not found', async (done: DoneCallback) => {
      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(1);
      });

      await controller
        .usedOutputMultimedia({ id: 1 })
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
      mockExperimentsFacade.usedOutputMultimedia.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .usedOutputMultimedia({ id: 1 })
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
      const experiment: Experiment = createEmptyExperiment();
      const valid = true;

      mockExperimentsFacade.validate.mockReturnValue(valid);

      const result: ResponseObject<boolean> = await controller.validate(experiment);
      const expected: ResponseObject<boolean> = { data: valid };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception with invalid parameters', async (done: DoneCallback) => {
      const experiment: Experiment = createEmptyExperiment();
      const errors: ValidationErrors = [];

      mockExperimentsFacade.validate.mockImplementationOnce(() => {
        throw new ExperimentNotValidException(experiment, errors);
      });

      await controller
        .validate(experiment)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID);
          expect(exception.params).toEqual(errors);
          done();
        });
    });
  });
});
