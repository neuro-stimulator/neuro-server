import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { EntityManager } from 'typeorm';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { repositorySequenceEntityMock, sequencesRepositoryProvider } from '../repository/repository-providers.jest';
import { SequenceEntity } from '../model/entity/sequence.entity';
import { SequenceRepository } from '../repository/sequence.repository';
import { SequenceIdNotFoundError } from '../exception/sequence-id-not-found.error';
import { sequenceToEntity } from '../repository/sequences.mapping';
import { SequencesService } from './sequences.service';

describe('Sequences service', () => {
  let testingModule: TestingModule;
  let service: SequencesService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        SequencesService,
        sequencesRepositoryProvider,
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [SequenceRepository],
        },
      ],
    }).compile();

    service = testingModule.get<SequencesService>(SequencesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available sequence results', async () => {
      const sequence: Sequence = createEmptySequence();
      const entityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.find.mockReturnValue([entityFromDB]);

      const result = await service.findAll();

      expect(result).toEqual([sequence]);
    });
  });

  describe('byId()', () => {
    it('positive - should return sequence by id', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const entityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.findOne.mockReturnValue(entityFromDB);

      const result = await service.byId(sequence.id);

      expect(result).toEqual(sequence);
    });

    it('negative - should not return any sequence', async (done: DoneCallback) => {
      const sequenceID = 1;

      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.byId(sequenceID);
        done.fail('SequenceIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof SequenceIdNotFoundError) {
          expect(e.sequenceID).toBe(sequenceID);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('insert()', () => {
    it('positive - should insert sequence result to database', async () => {
      const sequence: Sequence = createEmptySequence();
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.insert.mockReturnValue({ raw: 1 });

      await service.insert(sequence);

      expect(repositorySequenceEntityMock.insert).toBeCalledWith(sequenceEntityFromDB);
    });
  });

  describe('update()', () => {
    it('positive - should update existing sequence result in database', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.findOne.mockReturnValue(sequenceEntityFromDB);

      await service.update(sequence);

      expect(repositorySequenceEntityMock.update).toBeCalledWith({ id: sequence.id }, sequenceEntityFromDB);
    });

    it('negative - should not update non existing sequence result', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.update(sequence);
        done.fail('SequenceIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof SequenceIdNotFoundError) {
          expect(e.sequenceID).toBe(sequence.id);
          expect(repositorySequenceEntityMock.update).not.toBeCalled();
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing sequence result from database', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.findOne.mockReturnValue(sequenceEntityFromDB);

      await service.delete(sequence.id);

      expect(repositorySequenceEntityMock.delete).toBeCalled();
    });

    it('negative - should not delete non existing sequence result', async (done: DoneCallback) => {
      const sequenceID = 1;
      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.delete(sequenceID);
        done.fail('SequenceIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof SequenceIdNotFoundError) {
          expect(e.sequenceID).toBe(sequenceID);
          expect(repositorySequenceEntityMock.delete).not.toBeCalled();
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
