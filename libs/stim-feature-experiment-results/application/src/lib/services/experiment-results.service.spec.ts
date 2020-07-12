import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import DoneCallback = jest.DoneCallback;

import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, ExperimentType, IOEvent } from '@stechy1/diplomka-share';
import {
  ExperimentResultsRepository,
  ExperimentResultEntity,
  experimentResultToEntity,
  ExperimentResultIdNotFoundError,
  ExperimentResultIsNotInitializedException,
  AnotherExperimentResultIsInitializedException,
} from '@diplomka-backend/stim-feature-experiment-results/domain';

import { experimentResultsRepositoryProvider, repositoryExperimentResultEntityMock } from './repository-providers.jest';
import { ExperimentResultsService } from './experiment-results.service';

describe('Experiment results service', () => {
  let testingModule: TestingModule;
  let service: ExperimentResultsService;
  let experiment: Experiment;

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
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const entityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.find.mockReturnValue([entityFromDB]);

      const result = await service.findAll();

      expect(result).toEqual([experimentResult]);
    });
  });

  describe('byId()', () => {
    it('positive - should return experiment by id', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const entityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(entityFromDB);

      const result = await service.byId(experimentResult.id);

      expect(result).toEqual(experimentResult);
    });

    it('negative - should not return any experiment', async (done: DoneCallback) => {
      const experimentResultID = 1;

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.byId(experimentResultID);
        done.fail('ExperimentResultIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIdNotFoundError) {
          expect(e.experimentResultID).toBe(experimentResultID);
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('insert()', () => {
    it('positive - should insert experiment result to database', async () => {
      experiment.type = ExperimentType.CVEP;
      service.createEmptyExperimentResult(experiment);
      const experimentResult: ExperimentResult = service.activeExperimentResult;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.insert.mockReturnValue({ raw: 1 });

      await service.insert();

      expect(repositoryExperimentResultEntityMock.insert).toBeCalledWith(experimentResultEntityFromDB);
    });

    it('negative - should not insert experiment result when not initialized', async (done: DoneCallback) => {
      Object.defineProperty(service, 'activeExperimentResult', {
        get: jest.fn(() => {
          throw new ExperimentResultIsNotInitializedException();
        }),
      });

      try {
        await service.insert();
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exeception was thrown!');
        }
      }
    });
  });

  describe('update()', () => {
    it('positive - should update existing experiment result in database', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(experimentResultEntityFromDB);

      await service.update(experimentResult);

      expect(repositoryExperimentResultEntityMock.update).toBeCalledWith({ id: experimentResult.id }, experimentResultEntityFromDB);
    });

    it('negative - should not update non existing experiment result', async (done: DoneCallback) => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.update(experimentResult);
        done.fail('ExperimentResultIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIdNotFoundError) {
          expect(e.experimentResultID).toBe(experimentResult.id);
          expect(repositoryExperimentResultEntityMock.update).not.toBeCalled();
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing experiment result from database', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(experimentResultEntityFromDB);

      await service.delete(experimentResult.id);

      expect(repositoryExperimentResultEntityMock.delete).toBeCalled();
    });

    it('negative - should not delete non existing experiment result', async (done: DoneCallback) => {
      const experimentResultID = 1;
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      try {
        await service.delete(experimentResultID);
        done.fail('ExperimentResultIdNotFoundError was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIdNotFoundError) {
          expect(e.experimentResultID).toBe(experimentResultID);
          expect(repositoryExperimentResultEntityMock.delete).not.toBeCalled();
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('nameExists()', () => {
    let experimentResult: ExperimentResult;
    let entity: ExperimentResultEntity;

    beforeEach(() => {
      experimentResult = createEmptyExperimentResult(createEmptyExperiment());
      experimentResult.name = 'test';
      entity = experimentResultToEntity(experimentResult);
    });

    it('positive - new name should not exist in database for existing experimentResult', async () => {
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      const result = await service.nameExists('random', experimentResult.id);

      expect(result).toBeFalsy();
    });

    it('negative - new name should exist in database for existing experimentResult', async () => {
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(experimentResult);

      const result = await service.nameExists(experimentResult.name, experimentResult.id);

      expect(result).toBeTruthy();
    });
  });

  describe('activeExperimentResult', () => {
    it('positive - should create new active experiment result', () => {
      service.createEmptyExperimentResult(experiment);

      const expected: ExperimentResult = createEmptyExperimentResult(experiment);
      expected.date = service.activeExperimentResult.date;

      expect(service.activeExperimentResult).toEqual(expected);
    });

    it('positive - should clear active experiment result', (done: DoneCallback) => {
      try {
        const emptyResult = service.activeExperimentResult;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ExperimentResultIsNotInitializedException);
      }

      service.createEmptyExperimentResult(experiment);
      expect(service.activeExperimentResult).toBeDefined();

      service.clearRunningExperimentResult();
      try {
        const emptyResult = service.activeExperimentResult;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        expect(e).toBeInstanceOf(ExperimentResultIsNotInitializedException);
      }

      done();
    });

    it('negative - should not return data from noninitiailzed experiment result', (done: DoneCallback) => {
      try {
        const experimentResult = service.activeExperimentResult;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should not return data from noninitiailzed experiment result', (done: DoneCallback) => {
      try {
        const experimentResultData = service.activeExperimentResultData;
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });

    it('negative - should not create another active experiment result', (done: DoneCallback) => {
      service.createEmptyExperimentResult(experiment);

      try {
        service.createEmptyExperimentResult(experiment);
        done.fail('AnotherExperimentResultIsInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof AnotherExperimentResultIsInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });

  describe('pushResultData()', () => {
    const data: IOEvent = { name: 'ioEvent', index: 0, ioType: 'input', state: 'on', timestamp: 0 };

    it('positive - should push result data to collection', async () => {
      service.createEmptyExperimentResult(experiment);

      service.pushResultData(data);

      expect(service.activeExperimentResultData).toContain(data);
    });

    it('negative - should not push result data to uninitialized expeirment result', (done: DoneCallback) => {
      try {
        service.pushResultData(data);
        done.fail('ExperimentResultIsNotInitializedException was not thrown!');
      } catch (e) {
        if (e instanceof ExperimentResultIsNotInitializedException) {
          done();
        } else {
          done.fail('Unknown exception was thrown!');
        }
      }
    });
  });
});
