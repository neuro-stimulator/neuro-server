import { Test, TestingModule } from '@nestjs/testing';
import DoneCallback = jest.DoneCallback;

import { EntityManager } from 'typeorm';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceEntity, SequenceRepository, SequenceIdNotFoundException, sequenceToEntity } from '@diplomka-backend/stim-feature-sequences/domain';

import { NoOpLogger } from 'test-helpers/test-helpers';

import { repositorySequenceEntityMock, sequencesRepositoryProvider } from './repository-providers.jest';
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
    testingModule.useLogger(new NoOpLogger());

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
      const userID = 0;
      const entityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.findOne.mockReturnValue(entityFromDB);

      const result = await service.byId(sequence.id, userID);

      expect(result).toEqual(sequence);
    });

    it('negative - should not return any sequence', async (done: DoneCallback) => {
      const sequenceID = 1;
      const userID = 0;

      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.byId(sequenceID, userID);
        done.fail('SequenceIdNotFoundException was not thrown!');
      } catch (e) {
        if (e instanceof SequenceIdNotFoundException) {
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
      const userID = 0;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);
      sequenceEntityFromDB.userId = userID;

      repositorySequenceEntityMock.insert.mockReturnValue({ raw: 1 });

      await service.insert(sequence, userID);

      expect(repositorySequenceEntityMock.insert).toBeCalledWith(sequenceEntityFromDB);
    });
  });

  describe('update()', () => {
    it('positive - should update existing sequence result in database', async () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.findOne.mockReturnValue(sequenceEntityFromDB);

      await service.update(sequence, userID);

      expect(repositorySequenceEntityMock.update).toBeCalledWith({ id: sequence.id }, sequenceEntityFromDB);
    });

    it('negative - should not update non existing sequence result', async (done: DoneCallback) => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;
      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.update(sequence, userID);
        done.fail('SequenceIdNotFoundException was not thrown!');
      } catch (e) {
        if (e instanceof SequenceIdNotFoundException) {
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
      const userID = 0;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);

      repositorySequenceEntityMock.findOne.mockReturnValue(sequenceEntityFromDB);

      await service.delete(sequence.id, userID);

      expect(repositorySequenceEntityMock.delete).toBeCalled();
    });

    it('negative - should not delete non existing sequence result', async (done: DoneCallback) => {
      const sequenceID = 1;
      const userID = 0;

      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.delete(sequenceID, userID);
        done.fail('SequenceIdNotFoundException was not thrown!');
      } catch (e) {
        if (e instanceof SequenceIdNotFoundException) {
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
