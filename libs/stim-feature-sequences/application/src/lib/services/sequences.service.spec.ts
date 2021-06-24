import { Test, TestingModule } from '@nestjs/testing';

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

    it('negative - should not return any sequence', () => {
      const sequenceID = 1;
      const userID = 0;

      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      expect(() => service.byId(sequenceID, userID)).rejects.toThrow(new SequenceIdNotFoundException(sequenceID));
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

    it('negative - should not update non existing sequence result', () => {
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const userID = 0;
      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      expect(() => service.update(sequence, userID)).rejects.toThrow(new SequenceIdNotFoundException(sequence.id));
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

    it('negative - should not delete non existing sequence result', () => {
      const sequenceID = 1;
      const userID = 0;

      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      expect(() => service.delete(sequenceID, userID)).rejects.toThrow(new SequenceIdNotFoundException(sequenceID));
      expect(repositorySequenceEntityMock.delete).not.toBeCalled();
    });
  });

  describe('nameExists()', () => {
    let sequence: Sequence;
    let entity: SequenceEntity;

    beforeEach(() => {
      sequence = createEmptySequence();
      sequence.name = 'test';
      entity = sequenceToEntity(sequence);
    });

    it('positive - name should not exist in database for new sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      const result = await service.nameExists('random', 'new');

      expect(result).toBeFalsy();
    });

    it('negative - name should exist in database for new sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValue(sequence);

      const result = await service.nameExists(sequence.name, 'new');

      expect(result).toBeTruthy();
    });

    it('positive - new name should not exist in database for existing sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValue(undefined);

      const result = await service.nameExists('random', sequence.id);

      expect(result).toBeFalsy();
    });

    it('negative - new name should exist in database for existing sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValue(sequence);

      const result = await service.nameExists(sequence.name, sequence.id);

      expect(result).toBeTruthy();
    });
  });
});
