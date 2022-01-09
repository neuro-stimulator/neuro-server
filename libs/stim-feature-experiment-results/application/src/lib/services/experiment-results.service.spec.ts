import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, ExperimentType, Output } from '@stechy1/diplomka-share';
import {
  ExperimentResultEntity,
  ExperimentResultIdNotFoundException,
  ExperimentResultsRepository,
  experimentResultToEntity,
} from '@neuro-server/stim-feature-experiment-results/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { experimentResultsRepositoryProvider, repositoryExperimentResultEntityMock } from './repository-providers.jest';
import { ExperimentResultsService } from './experiment-results.service';

describe('Experiment results service', () => {
  let testingModule: TestingModule;
  let service: ExperimentResultsService;
  let experiment: Experiment<Output>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultsService,
        experimentResultsRepositoryProvider,
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [ExperimentResultsRepository],
        },
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<ExperimentResultsService>(ExperimentResultsService);

    experiment = createEmptyExperiment();
    experiment.id = 1;
    experiment.name = 'test';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available experiment results', async () => {
      const userGroups = [1];
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const entityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      (repositoryExperimentResultEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getMany.mockReturnValueOnce([entityFromDB]);

      const result = await service.findAll({ userGroups });

      expect(result).toEqual([experimentResult]);
    });
  });

  describe('byId()', () => {
    it('positive - should return experiment by id', async () => {
      const userGroups = [1];
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const entityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      (repositoryExperimentResultEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);

      const result = await service.byId(userGroups, experimentResult.id);

      expect(result).toEqual(experimentResult);
    });

    it('negative - should not return any experiment', () => {
      const userGroups = [1];
      const experimentResultID = 1;

      (repositoryExperimentResultEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(undefined);

      expect(() => service.byId(userGroups, experimentResultID)).rejects.toThrow(new ExperimentResultIdNotFoundException(experimentResultID));
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment result to database', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.type = ExperimentType.CVEP;
      const userID = 0;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);
      experimentResultEntityFromDB.userId = userID;

      repositoryExperimentResultEntityMock.save.mockReturnValueOnce(experimentResultEntityFromDB);

      await service.insert(experimentResult, userID);

      expect(repositoryExperimentResultEntityMock.save).toBeCalledWith(experimentResultEntityFromDB);
    });
  });

  describe('update()', () => {
    it('positive - should update existing experiment result in database', async () => {
      const userGroups = [1];
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const experimentResult2: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult2.id = 2;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);
      const experimentResultEntityFromDB2: ExperimentResultEntity = experimentResultToEntity(experimentResult2);

      (repositoryExperimentResultEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(experimentResultEntityFromDB);
      repositoryExperimentResultEntityMock.save.mockReturnValueOnce(experimentResultEntityFromDB2);

      await service.update(userGroups, experimentResult2);

      expect(repositoryExperimentResultEntityMock.save).toBeCalledWith(experimentResultEntityFromDB2);
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing experiment result from database', async () => {
      const experimentResultID = 1;

      await service.delete(experimentResultID);

      expect(repositoryExperimentResultEntityMock.delete).toBeCalledWith({ id: experimentResultID });
    });
  });

  describe('nameExists()', () => {
    let experimentResult: ExperimentResult;

    beforeEach(() => {
      experimentResult = createEmptyExperimentResult(createEmptyExperiment());
      experimentResult.name = 'test';
    });

    it('positive - new name should not exist in database for existing experimentResult', async () => {
      repositoryExperimentResultEntityMock.findOne.mockReturnValueOnce(undefined);

      const result = await service.nameExists('random', experimentResult.id);

      expect(result).toBeFalsy();
    });

    it('negative - new name should exist in database for existing experimentResult', async () => {
      repositoryExperimentResultEntityMock.findOne.mockReturnValueOnce(experimentResult);

      const result = await service.nameExists(experimentResult.name, experimentResult.id);

      expect(result).toBeTruthy();
    });
  });
});
