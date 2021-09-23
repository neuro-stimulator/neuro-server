import { Test, TestingModule } from '@nestjs/testing';

import { createEmptySequence, Experiment, MessageCodes, Output, ResponseObject, Sequence } from '@stechy1/diplomka-share';

import { ControllerException, ValidationErrors } from '@diplomka-backend/stim-lib-common';
import { ExperimentIdNotFoundException } from '@diplomka-backend/stim-feature-experiments/domain';
import {
  SequenceIdNotFoundException,
  SequenceWasNotCreatedException,
  SequenceNotValidException,
  SequenceWasNotUpdatedException,
  ExperimentDoNotSupportSequencesException,
  SequenceWasNotDeletedException,
  InvalidSequenceSizeException,
} from '@diplomka-backend/stim-feature-sequences/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { createSequencesFacadeMock } from '../service/sequences.facade.jest';
import { SequencesFacade } from '../service/sequences.facade';
import { SequencesController } from './sequences.controller';

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
    testingModule.useLogger(new NoOpLogger());

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
      const userGroups = [1];
      const sequences: Sequence[] = [];

      mockSequencesFacade.sequencesAll.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.all(userGroups);
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    // noinspection DuplicatedCode
    it('negative - when something gets wrong', () => {
      const userGroups = [1];

      mockSequencesFacade.sequencesAll.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.all(userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('sequenceById()', () => {
    it('positive - should find sequence by id', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userGroups = [1];

      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.sequenceById({ id: sequence.id }, userGroups);
      const expected: ResponseObject<Sequence> = { data: sequence };

      expect(result).toEqual(expected);
    });

    it('negative - should throw an exception when sequence not found',  () => {
      const sequenceID = 1;
      const userGroups = [1];

      mockSequencesFacade.sequenceById.mockImplementation(() => {
        throw new SequenceIdNotFoundException(sequenceID);
      });

      expect(() => controller.sequenceById({ id: sequenceID }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, { id: sequenceID}));
    });

    it('negative - should throw an exception when unknown error', () => {
      const sequenceID = 1
      const userGroups = [1];

      mockSequencesFacade.sequenceById.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.sequenceById({ id: sequenceID }, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('insert()', () => {
    it('positive - should insert sequence', async () => {
      const sequence: Sequence = createEmptySequence();
      const userID = 0;
      const userGroups = [1];

      mockSequencesFacade.insert.mockReturnValue(1);
      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.insert(sequence, userID, userGroups);
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

    it('negative - should not insert when query error', () => {
      const sequence: Sequence = createEmptySequence();
      const userID = 0;
      const userGroups = [1];

      mockSequencesFacade.insert.mockImplementation(() => {
        throw new SequenceWasNotCreatedException(sequence);
      });

      expect(() => controller.insert(sequence, userID, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_CREATED, { id: sequence.id }));
    });

    it('negative - should not insert sequence when unknown error', () => {
      const sequence: Sequence = createEmptySequence();
      const userID = 0;
      const userGroups = [1];

      mockSequencesFacade.insert.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.insert(sequence, userID, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('update()', () => {
    it('positive - should update sequence', async () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.update(sequence, userGroups);
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

    it('negative - should not update sequence which is not found', () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userGroups = [1];

      mockSequencesFacade.update.mockImplementation(() => {
        throw new SequenceIdNotFoundException(sequence.id);
      });

      expect(() => controller.update(sequence, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, { id: sequence.id }));
    });

    it('negative - should not update sequence because of problem with update', () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.update.mockImplementation(() => {
        throw new SequenceWasNotUpdatedException(sequence);
      });

      expect(() => controller.update(sequence, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_UPDATED, { id: sequence.id }));
    });

    it('negative - should not update sequence when unknown error', () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;

      mockSequencesFacade.update.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.update(sequence, userGroups)).rejects.toThrow(new ControllerException());
    });

    it('negative - should not update invalid sequence', () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      const errors: ValidationErrors = [];

      mockSequencesFacade.update.mockImplementation(() => {
        throw new SequenceNotValidException(sequence, errors);
      });

      expect(() => controller.update(sequence, userGroups)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_VALID, { errors }));
    });
  });

  describe('delete()', () => {
    it('positive - should delete sequence', async () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();

      mockSequencesFacade.sequenceById.mockReturnValue(sequence);

      const result: ResponseObject<Sequence> = await controller.delete(
        {
          id: 1,
        },
        userGroups
      );
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

    it('negative - should not delete sequence which is not found', () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userGroups = [1];

      mockSequencesFacade.delete.mockImplementation(() => {
        throw new SequenceIdNotFoundException(sequence.id);
      });

      expect(() => controller.delete({ id: sequence.id }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND, { id: sequence.id}));
    });

    it('negative - should not delete sequence when unknown error', () => {
      const id = 1;
      const userGroups = [1];

      mockSequencesFacade.validate.mockReturnValue(true);
      mockSequencesFacade.delete.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.delete({ id }, userGroups)).rejects.toThrow(new ControllerException());
    });

    it('negative - should not delete sequence because of problem with delete', () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userGroups = [1];

      mockSequencesFacade.validate.mockReturnValue(true);
      mockSequencesFacade.delete.mockImplementation(() => {
        throw new SequenceWasNotDeletedException(sequence.id);
      });

      expect(() => controller.delete({ id: sequence.id }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_DELETED, { id: sequence.id }));
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

  describe('experimentsAsSequenceSource()', () => {
    it('positive - should return all experiments supporting sequences', async () => {
      const experiments: Experiment<Output>[] = [];
      const userGroups = [1];

      mockSequencesFacade.experimentsAsSequenceSource.mockReturnValue(experiments);

      const result: ResponseObject<Experiment<Output>[]> = await controller.experimentsAsSequenceSource(userGroups);
      const expected: ResponseObject<Experiment<Output>[]> = { data: experiments };

      expect(result).toEqual(expected);
    });
  });

  describe('sequencesForExperiment()', () => {
    it('positive - should find all sequences for one experiment ID', async () => {
      const experimentID = 1;
      const sequences: Sequence[] = [];
      const userGroups = [1];

      mockSequencesFacade.sequencesForExperiment.mockReturnValue(sequences);

      const result: ResponseObject<Sequence[]> = await controller.sequencesForExperiment({ id: experimentID }, userGroups);
      const expected: ResponseObject<Sequence[]> = { data: sequences };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when experiment not found', () => {
      const experimentID = -1;
      const userGroups = [1];

      mockSequencesFacade.sequencesForExperiment.mockImplementation(() => {
        throw new ExperimentIdNotFoundException(experimentID);
      });

      expect(() => controller.sequencesForExperiment({ id: experimentID }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND, { id: experimentID }));
    });

    it('negative - should throw exception when experiment do not support sequences', () => {
      const experimentID = -1;
      const userGroups = [1];

      mockSequencesFacade.sequencesForExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesException(experimentID);
      });

      expect(() => controller.sequencesForExperiment({ id: experimentID }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES, { id: experimentID }));
    });

    it('negative - should throw exception when unknown error occured', () => {
      const experimentID = -1;
      const userGroups = [1];

      mockSequencesFacade.sequencesForExperiment.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.sequencesForExperiment({ id: experimentID }, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('generateSequenceForExperiment()', () => {
    it('positive - should generate sequence for experiment', async () => {
      const experimentID = 1;
      const size = 10;
      const numbers: number[] = [];
      const userGroups = [1];

      mockSequencesFacade.generateSequenceForExperiment.mockReturnValue(numbers);

      const result: ResponseObject<number[]> = await controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size }, userGroups);
      const expected: ResponseObject<number[]> = { data: numbers };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when experiment do not support sequences', () => {
      const experimentID = -1;
      const size = 10;
      const userGroups = [1];

      mockSequencesFacade.generateSequenceForExperiment.mockImplementation(() => {
        throw new ExperimentDoNotSupportSequencesException(experimentID);
      });

      expect(() => controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES, { id: experimentID }));
    });

    it('negative - should throw exception when sequence length is invalid', () => {
      const experimentID = -1;
      const size = -5;
      const userGroups = [1];

      mockSequencesFacade.generateSequenceForExperiment.mockImplementation(() => {
        throw new InvalidSequenceSizeException(size);
      });

      expect(() => controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size }, userGroups))
      .rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_INVALID_SIZE, { sequenceSize: size }));
    });

    it('negative - should throw exception when unknown error occured', () => {
      const experimentID = -1;
      const size = 10;
      const userGroups = [1];

      mockSequencesFacade.generateSequenceForExperiment.mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.generateSequenceForExperiment({ id: experimentID, sequenceSize: size }, userGroups)).rejects.toThrow(new ControllerException());
    });
  });

  describe('validate()', () => {
    it('positive - should return true when sequence is valid', async () => {
      const sequence: Sequence = createEmptySequence();
      const valid = true;

      mockSequencesFacade.validate.mockReturnValue(valid);

      const result: ResponseObject<boolean> = await controller.validate(sequence);
      const expected: ResponseObject<boolean> = { data: valid };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception with invalid parameters', () => {
      const sequence: Sequence = createEmptySequence();
      const errors: ValidationErrors = [];

      mockSequencesFacade.validate.mockImplementationOnce(() => {
        throw new SequenceNotValidException(sequence, errors);
      });

      expect(() => controller.validate(sequence)).rejects.toThrow(new ControllerException(MessageCodes.CODE_ERROR_SEQUENCE_NOT_VALID, { errors }));
    });
  });
});
