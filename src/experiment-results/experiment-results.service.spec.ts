import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentResultsService } from './experiment-results.service';
import { ExperimentResultEntity } from './entity/experiment-result.entity';
import { SerialService } from '../low-level/serial.service';
import { ExperimentsService } from '../experiments/experiments.service';
import { createSerialServiceMock } from '../low-level/serial.service.jest';
import { createExperimentsServiceMock } from '../experiments/experiments.service.jest';
import { experimentResultsRepositoryProvider, repositoryExperimentResultEntityMock } from './repository-providers.jest';
import { EntityManager } from 'typeorm';
import { ExperimentResultsRepository } from './repository/experiment-results.repository';
import { createEmptyExperiment, createEmptyExperimentResult, Experiment, ExperimentResult, ExperimentType } from '@stechy1/diplomka-share';
import { experimentResultToEntity } from './experiment-results.mapping';
import { FileBrowserService } from '../file-browser/file-browser.service';
import { createFileBrowserServiceMock } from '../file-browser/file-browser.service.jest';
import { MockType } from '../test-helpers';
import DoneCallback = jest.DoneCallback;

describe('Experiment results service', () => {
  let testingModule: TestingModule;
  let experimentResultsService: ExperimentResultsService;
  let experiment: Experiment;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentResultsService,
        experimentResultsRepositoryProvider,
        { provide: SerialService, useFactory: createSerialServiceMock },
        { provide: ExperimentsService, useFactory: createExperimentsServiceMock },
        {
          provide: EntityManager,
          useFactory: (rep) => ({ getCustomRepository: () => rep }),
          inject: [ExperimentResultsRepository]
        },
        { provide: FileBrowserService, useFactory: createFileBrowserServiceMock }
      ]
    }).compile();

    experimentResultsService = testingModule.get<ExperimentResultsService>(ExperimentResultsService);
    experimentResultsService.registerMessagePublisher(jest.fn());


    experiment = createEmptyExperiment();
    experiment.id = 1;
    experiment.name = 'test';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(experimentResultsService).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available experiment results', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const entityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.find.mockReturnValue([entityFromDB]);

      const result = await experimentResultsService.findAll();

      expect(result).toEqual([experimentResult]);
    });
  });

  describe('byId()', () => {
    it('positive - should return experiment by id', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const entityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(entityFromDB);

      const result = await experimentResultsService.byId(experimentResult.id);

      expect(result).toEqual(experimentResult);
    });

    it('negative - should not return any experiment', async () => {
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      const result = await experimentResultsService.byId(1);

      expect(result).toBeUndefined();
    });
  });

  describe('insert()', () => {

    let fileBrowserServiceMock: MockType<FileBrowserService>;

    beforeEach(() => {
      // @ts-ignore
      fileBrowserServiceMock = testingModule.get<MockType<FileBrowserService>>(FileBrowserService);
    });

    it('positive - should insert experiment result to database', async () => {
      experiment.type = ExperimentType.CVEP;
      experimentResultsService.createEmptyExperimentResult(experiment);
      const experimentResult: ExperimentResult = experimentResultsService.activeExperimentResult;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.insert.mockReturnValue({ raw: 1 });
      fileBrowserServiceMock.writeFileContent.mockReturnValue(true);

      await experimentResultsService.insert();

      expect(repositoryExperimentResultEntityMock.insert).toBeCalledWith(experimentResultEntityFromDB);
      expect(experimentResultsService.activeExperimentResult).toBeNull();
    });

    it('negative - should not insert experiment result when not initialized', async (done: DoneCallback) => {
      try {
        await experimentResultsService.insert();
        done.fail();
      } catch (e) {
        done();
      }
    });

    it('negative - should log error when could not write result data to filesystem', async () => {
      experiment.type = ExperimentType.CVEP;
      experimentResultsService.createEmptyExperimentResult(experiment);
      const experimentResult: ExperimentResult = experimentResultsService.activeExperimentResult;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.insert.mockReturnValue({ raw: 1 });
      fileBrowserServiceMock.writeFileContent.mockReturnValue(false);

      await experimentResultsService.insert();

      expect(repositoryExperimentResultEntityMock.insert).toBeCalledWith(experimentResultEntityFromDB);
      expect(experimentResultsService.activeExperimentResult).toBeNull();
    });
  });

  describe('update()', () => {
    it('positive - should update existing experiment result in database', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(experimentResultEntityFromDB);

      const result = await experimentResultsService.update(experimentResult);

      expect(repositoryExperimentResultEntityMock.update).toBeCalled();
      expect(result).toEqual(experimentResult);
    });

    it('negative - should not update non existing experiment result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      const result = await experimentResultsService.update(experimentResult);

      expect(repositoryExperimentResultEntityMock.update).not.toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('delete()', () => {
    it('positive - should delete existing experiment result from database', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      const experimentResultEntityFromDB: ExperimentResultEntity = experimentResultToEntity(experimentResult);

      repositoryExperimentResultEntityMock.findOne.mockReturnValue(experimentResultEntityFromDB);

      const result = await experimentResultsService.delete(experimentResult.id);

      expect(repositoryExperimentResultEntityMock.delete).toBeCalled();
      expect(result).toEqual(experimentResult);
    });

    it('negative - should not delete non existing experiment result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      const result = await experimentResultsService.delete(experimentResult.id);

      expect(repositoryExperimentResultEntityMock.delete).not.toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('experimentData()', () => {
    it('negative - should return no data for non existing experiment result', async () => {
      repositoryExperimentResultEntityMock.findOne.mockReturnValue(undefined);

      expect(await experimentResultsService.experimentData(1)).toBeUndefined();
    });
  });

  describe('validateExperimentResult()', () => {
    it('positive - should return valid result', async () => {
      const experimentResult: ExperimentResult = createEmptyExperimentResult(experiment);
      experimentResult.id = 1;
      experimentResult.name = 'test';
      experimentResult.type = ExperimentType.CVEP;

      expect(await experimentResultsService.validateExperimentResult(experimentResult)).toBeTruthy();
    });
  });

  describe('activeExperimentResult', () => {
    it('negative - should not be defined', () => {
      expect(experimentResultsService.activeExperimentResult).toBeNull();
    });

    it('positive - should create new active experiment result', () => {
      experimentResultsService.createEmptyExperimentResult(experiment);

      const expected: ExperimentResult = createEmptyExperimentResult(experiment);
      expected.date = experimentResultsService.activeExperimentResult.date;

      expect(experimentResultsService.activeExperimentResult).toEqual(expected);
    });

    it('positive - should clear active experiment result', () => {
      expect(experimentResultsService.activeExperimentResult).toBeNull();

      experimentResultsService.createEmptyExperimentResult(experiment);
      expect(experimentResultsService.activeExperimentResult).toBeDefined();

      experimentResultsService.clearRunningExperimentResult();
      expect(experimentResultsService.activeExperimentResult).toBeNull();
    });
  });
});
