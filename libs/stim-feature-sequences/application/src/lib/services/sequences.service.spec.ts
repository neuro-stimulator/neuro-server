import { Test, TestingModule } from '@nestjs/testing';

import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { createEmptySequence, Sequence } from '@stechy1/diplomka-share';

import { SequenceEntity, SequenceRepository, SequenceIdNotFoundException, sequenceToEntity } from '@neuro-server/stim-feature-sequences/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

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
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      const entityFromDB: SequenceEntity = sequenceToEntity(sequence);

      (repositorySequenceEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getMany.mockReturnValueOnce([entityFromDB]);

      const result = await service.findAll({ userGroups });

      expect(result).toEqual([sequence]);
    });
  });

  describe('byId()', () => {
    it('positive - should return sequence by id', async () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const entityFromDB: SequenceEntity = sequenceToEntity(sequence);

      (repositorySequenceEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);

      const result = await service.byId(userGroups, sequence.id);

      expect(result).toEqual(sequence);
    });

    it('negative - should not return any sequence', () => {
      const userGroups = [1];
      const sequenceID = 1;

      (repositorySequenceEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(undefined);

      expect(() => service.byId(userGroups, sequenceID)).rejects.toThrow(new SequenceIdNotFoundException(sequenceID));
    });
  });

  describe('insert()', () => {
    it('positive - should insert sequence result to database', async () => {
      const sequence: Sequence = createEmptySequence();
      const userID = 0;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);
      sequenceEntityFromDB.userId = userID;

      repositorySequenceEntityMock.save.mockReturnValueOnce(sequenceEntityFromDB);

      await service.insert(sequence, userID);

      expect(repositorySequenceEntityMock.save).toBeCalledWith(sequenceEntityFromDB);
    });
  });

  describe('update()', () => {
    it('positive - should update existing sequence result in database', async () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      const sequence2: Sequence = createEmptySequence();
      sequence2.id = 2;
      const sequenceEntityFromDB: SequenceEntity = sequenceToEntity(sequence);
      const sequenceEntityFromDB2: SequenceEntity = sequenceToEntity(sequence2);

      (repositorySequenceEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(sequenceEntityFromDB);
      repositorySequenceEntityMock.save.mockReturnValueOnce(sequenceEntityFromDB2)

      await service.update(userGroups, sequence2);

      expect(repositorySequenceEntityMock.save).toBeCalledWith(sequenceEntityFromDB2);
    });

    it('negative - should not update non existing sequence result', () => {
      const userGroups = [1];
      const sequence: Sequence = createEmptySequence();
      sequence.id = 1;
      (repositorySequenceEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(undefined);

      expect(() => service.update(userGroups, sequence)).rejects.toThrow(new SequenceIdNotFoundException(sequence.id));
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing sequence result from database', async () => {
      const sequenceID = 1;

      await service.delete(sequenceID);

      expect(repositorySequenceEntityMock.delete).toBeCalledWith({ id: sequenceID });
    });
  });

  describe('nameExists()', () => {
    let sequence: Sequence;

    beforeEach(() => {
      sequence = createEmptySequence();
      sequence.name = 'test';
      sequence.data = [];
    });

    it('positive - name should not exist in database for new sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValueOnce(undefined);

      const result = await service.nameExists('random', 'new');

      expect(result).toBeFalsy();
    });

    it('negative - name should exist in database for new sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValueOnce(sequence);

      const result = await service.nameExists(sequence.name, 'new');

      expect(result).toBeTruthy();
    });

    it('positive - new name should not exist in database for existing sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValueOnce(undefined);

      const result = await service.nameExists('random', sequence.id);

      expect(result).toBeFalsy();
    });

    it('negative - new name should exist in database for existing sequence', async () => {
      repositorySequenceEntityMock.findOne.mockReturnValueOnce(sequence);

      const result = await service.nameExists(sequence.name, sequence.id);

      expect(result).toBeTruthy();
    });
  });
});
