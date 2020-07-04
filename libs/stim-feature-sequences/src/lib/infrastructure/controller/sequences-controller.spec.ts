import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { createEmptySequence, MessageCodes, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { ExperimentIdNotFoundError } from '@diplomka-backend/stim-feature-experiments';

import { MockType } from 'test-helpers/test-helpers';

import { SequenceIdNotFoundError } from '../../domain/exception/sequence-id-not-found.error';
import { SequenceWasNotCreatedError } from '../../domain/exception/sequence-was-not-created.error';
import { SequenceNotValidException } from '../../domain/exception/sequence-not-valid.exception';
import { SequenceWasNotUpdatedError } from '../../domain/exception/sequence-was-not-updated.error';
import { ExperimentDoNotSupportSequencesError } from '../../domain/exception/experiment-do-not-support-sequences.error';
import { SequenceWasNotDeletedError } from '../../domain/exception/sequence-was-not-deleted.error';
import { InvalidSequenceSizeException } from '../../domain/exception/invalid-sequence-size.exception';
import { createSequencesFacadeMock } from '../service/sequences.facade.jest';
import { SequencesFacade } from '../service/sequences.facade';
import { SequencesController } from './sequences-controller';

describe('Sequences controller', () => {
  let testingModule: TestingModule;
  let controller: SequencesController;
  let mockSequencesFacade: MockType<SequencesFacade>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [SequencesController],
      providers: [
        {
          provide: SequencesFacade,
          useFactory: createSequencesFacadeMock,
        },
      ],
    }).compile();

    controller = testingModule.get<SequencesController>(SequencesController);
    // @ts-ignore
    mockSequencesFacade = testingModule.get<MockType<SequencesFacade>>(SequencesFacade);
  });

  afterEach(() => {
    mockSequencesFacade.sequencesAll.mockClear();
    mockSequencesFacade.sequenceById.mockClear();
    mockSequencesFacade.validate.mockClear();
    mockSequencesFacade.insert.mockClear();
    mockSequencesFacade.update.mockClear();
    mockSequencesFacade.delete.mockClear();
    mockSequencesFacade.nameExists.mockClear();
    mockSequencesFacade.sequencesForExperiment.mockClear();
    mockSequencesFacade.generateSequenceForExperiment.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all sequences', async () => {
      const sequences: Sequence[] = [];

      mockSequencesFacade.sequencesAll.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.all();
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', async (done: DoneCallback) => {
      mockSequencesFacade.sequencesAll.mockImplementation(() => {
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

  describe('sequenceById()', () => {
    it('positive - should find sequence by id', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.sequenceById({ id: sequence.id });
      const expected: ResponseObject<Sequence> = { data: sequence };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when sequence not found', async (done: DoneCallback) => {
      const sequenceID = 1;

      mockSequencesFacade.sequenceById.mockImplementation(() => {
        throw new SequenceIdNotFoundError(sequenceID);
      });

      controller
        .sequenceById({ id: sequenceID })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND);
          expect(exception.params).toEqual({ id: sequenceID });
          done();
        });
    });

    it('negative - should throw an exception when unknown error', async (done: DoneCallback) => {
      mockSequencesFacade.sequenceById.mockImplementation(() => {
        throw new Error();
      });

      controller
        .sequenceById({ id: 1 })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('insert()', () => {
    it('positive - should insert sequence', async () => {
      const sequence: Sequence = createEmptySequence();

      mockSequencesFacade.insert.mockReturnValue(1);
      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.insert(sequence);
      const expected: ResponseObject<Sequence> = {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_CREATED,
          params: {
            id: sequence.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not insert invalid sequence', async () => {
      const sequence: Sequence = createEmptySequence();

      mockSequencesFacade.insert.mockReturnValue(sequence);

      // TODO vymyslet jak ošetřit nevalidní sequenci
    });

    it('negative - should not insert when query error', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();

      mockSequencesFacade.insert.mockImplementation(() => {
        throw new SequenceWasNotCreatedError(sequence);
      });

      await controller
        .insert(sequence)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_CREATED);
          done();
        });
    });

    it('negative - should not insert sequence when unknown error', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();

      mockSequencesFacade.insert.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .insert(sequence)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });
  });

  describe('update()', () => {
    it('positive - should update sequence', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.update(sequence);
      const expected: ResponseObject<Sequence> = {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_UPDATED,
          params: {
            id: sequence.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not update sequence which is not found', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.update.mockImplementation(() => {
        throw new SequenceIdNotFoundError(sequence.id);
      });

      await controller
        .update(sequence)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND);
          expect(exception.params).toEqual({ id: sequence.id });
          done();
        });
    });

    it('negative - should not update sequence because of problem with update', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.update.mockImplementation(() => {
        throw new SequenceWasNotUpdatedError(sequence);
      });

      await controller
        .update(sequence)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_UPDATED);
          expect(exception.params).toEqual({ id: sequence.id });
          done();
        });
    });

    it('negative - should not update sequence when unknown error', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      mockSequencesFacade.update.mockImplementation(() => {
        throw new Error();
      });

      await controller
        .update(sequence)
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR);
          done();
        });
    });

    it('negative - should not update invalid sequence', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      mockSequencesFacade.update.mockImplementation(() => {
        throw new SequenceNotValidException(sequence);
      });

      await controller
        .update(sequence)
        .then(() => done.fail())
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_VALID);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('positive - should delete sequence', async () => {
      const sequence: Sequence = createEmptySequence();

      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.delete({
        id: 1,
      });
      const expected: ResponseObject<Sequence> = {
        data: sequence,
        message: {
          code: MessageCodes.CODE_SUCCESS_SEQUENCE_DELETED,
          params: {
            id: sequence.id,
          },
        },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should not delete sequence which is not found', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.delete.mockImplementation(() => {
        throw new SequenceIdNotFoundError(sequence.id);
      });

      await controller
        .delete({ id: sequence.id })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND);
          expect(exception.params).toEqual({ id: sequence.id });
          done();
        });
    });

    it('negative - should not delete sequence when unknown error', async (done: DoneCallback) => {
      const id = 1;
      mockSequencesFacade.validate.mockReturnValue(true);
      mockSequencesFacade.delete.mockImplementation(() => {
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

    it('negative - should not delete sequence because of problem with delete', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      mockSequencesFacade.validate.mockReturnValue(true);
      mockSequencesFacade.delete.mockImplementation(() => {
        throw new SequenceWasNotDeletedError(sequence.id);
      });

      await controller
        .delete({ id: sequence.id })
        .then(() => {
          done.fail();
        })
        .catch((exception: ControllerException) => {
          expect(exception.errorCode).toEqual(MessageCodes.CODE_ERROR_SEQUENCE_NOT_DELETED);
          expect(exception.params).toEqual({ id: sequence.id });
          done();
        });
    });
  });

  describe('nameExists()', () => {
    it('positive - should check name existence of a sequence', async () => {
      mockSequencesFacade.nameExists.mockReturnValue(false);

      const result: ResponseObject<{
        exists: boolean;
      }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: false },
      };

      expect(result).toEqual(expected);
    });

    it('negative - should check name existence of a sequence', async () => {
      mockSequencesFacade.nameExists.mockReturnValue(true);

      const result: ResponseObject<{ exists: boolean }> = await controller.nameExists({ name: 'test', id: 'new' });
      const expected: ResponseObject<{ exists: boolean }> = {
        data: { exists: true },
      };

      expect(result).toEqual(expected);
    });
  });

  describe('sequencesForExperiment()', () => {
    it('positive - should find all sequences for one experiment ID', async () => {
      const experimentID = 1;
      const sequences: Sequence[] = [];

      mockSequencesFacade.sequencesForExperiment.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.sequencesForExperiment({ id: experimentID });
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when experiment not found', async (done: DoneCallback) => {
      const experimentID = -1;

      mockSequencesFacade.sequencesForExperiment.mockImplementation(() => {
        throw new ExperimentIdNotFoundError(experimentID);
      });

      try {
        await controller.sequencesForExperiment({ id: experimentID });
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND);
          expect(e.params).toEqual({ id: experimentID });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when experiment do not support sequences', async (done: DoneCallback) => {
      const experimentID = -1;

      mockSequencesFacade.sequencesForExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesError(experimentID);
      });

      try {
        await controller.sequencesForExperiment({ id: experimentID });
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES);
          expect(e.params).toEqual({ id: experimentID });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const experimentID = -1;

      mockSequencesFacade.sequencesForExperiment.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.sequencesForExperiment({ id: experimentID });
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('generateSequenceForExperiment()', () => {
    it('positive - should generate sequence for experiment', async () => {
      const experimentID = 1;
      const size = 10;
      const numbers: number[] = [];

      mockSequencesFacade.generateSequenceForExperiment.mockReturnValue(numbers);

      const result: ResponseObject<number[]> = await controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size });
      const expected: ResponseObject<number[]> = { data: numbers };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when experiment do not support sequences', async (done: DoneCallback) => {
      const experimentID = -1;
      const size = 10;

      mockSequencesFacade.generateSequenceForExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesError(experimentID);
      });

      try {
        await controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size });
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES);
          expect(e.params).toEqual({ id: experimentID });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when sequence length is invalid', async (done: DoneCallback) => {
      const experimentID = -1;
      const size = -5;

      mockSequencesFacade.generateSequenceForExperiment.mockImplementation(() => {
        throw new InvalidSequenceSizeException(size);
      });

      try {
        await controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size });
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
          expect(e.params).toEqual({ sequenceSize: size });
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should throw exception when unknown error occured', async (done: DoneCallback) => {
      const experimentID = -1;
      const size = 10;

      mockSequencesFacade.generateSequenceForExperiment.mockImplementation(() => {
        throw new Error();
      });

      try {
        await controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size });
        done.fail('ControllerException was not thrown!');
      } catch (e) {
        if (e instanceof ControllerException) {
          expect(e.errorCode).toBe(MessageCodes.CODE_ERROR);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
