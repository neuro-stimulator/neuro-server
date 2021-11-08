import { Test, TestingModule } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';

import {
  createEmptyExperiment,
  createEmptyExperimentCVEP,
  createEmptyExperimentERP,
  createEmptyExperimentFVEP,
  createEmptyExperimentREA,
  createEmptyExperimentTVEP,
  createEmptyOutputCVEP,
  createEmptyOutputERP,
  createEmptyOutputFVEP,
  createEmptyOutputREA,
  createEmptyOutputTVEP,
  CvepOutput,
  ErpOutput,
  Experiment,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP,
  ExperimentType,
  FvepOutput,
  Output,
  ReaOutput,
  TvepOutput,
} from '@stechy1/diplomka-share';

import {
  experimentCvepToEntity,
  experimentCvepOutputToEntity,
  experimentErpOutputToEntity,
  experimentErpToEntity,
  experimentFvepOutputToEntity,
  experimentFvepToEntity,
  experimentReaToEntity,
  experimentReaOutputToEntity,
  experimentToEntity,
  experimentTvepOutputToEntity,
  experimentTvepToEntity,
  ExperimentEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentCvepEntity,
  ExperimentCvepOutputEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
  ExperimentReaEntity,
  ExperimentIdNotFoundException,
  ExperimentReaOutputEntity,
} from '@neuro-server/stim-feature-experiments/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { ExperimentsService } from './experiments.service';
import {
  experimentRepositoryCvepProvider,
  experimentRepositoryErpProvider,
  experimentRepositoryFvepProvider,
  experimentRepositoryProvider,
  experimentRepositoryReaProvider,
  experimentRepositoryTvepProvider,
  repositoryExperimentCvepEntityMock,
  repositoryExperimentCvepOutputEntityMock,
  repositoryExperimentEntityMock,
  repositoryExperimentErpEntityMock,
  repositoryExperimentErpOutputDependencyEntityMock,
  repositoryExperimentErpOutputEntityMock,
  repositoryExperimentFvepEntityMock,
  repositoryExperimentFvepOutputEntityMock,
  repositoryExperimentReaEntityMock,
  repositoryExperimentReaOutputEntityMock,
  repositoryExperimentTvepEntityMock,
  repositoryExperimentTvepOutputEntityMock,
} from './repository-providers.jest';

describe('Experiments service', () => {
  let testingModule: TestingModule;
  let experimentsService: ExperimentsService;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentsService,
        experimentRepositoryProvider,
        experimentRepositoryErpProvider,
        experimentRepositoryCvepProvider,
        experimentRepositoryFvepProvider,
        experimentRepositoryTvepProvider,
        experimentRepositoryReaProvider,
      ],
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    experimentsService = testingModule.get<ExperimentsService>(ExperimentsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(experimentsService).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available experiments', async () => {
      const userGroups = [1];
      const experiment: Experiment<Output> = createEmptyExperiment();
      experiment.id = 1;
      const entityFromDB: ExperimentEntity = experimentToEntity(experiment);

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getMany.mockReturnValueOnce([entityFromDB]);

      const result = await experimentsService.findAll({ userGroups });

      expect(result).toEqual([experiment]);
    });
  });

  describe('byId()', () => {

    it('negative - should throw exception when not found', () => {
      const userGroups = [1];
      const wrongExperimentID = 1;

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(undefined);

      expect(() => experimentsService.byId(userGroups, wrongExperimentID)).rejects.toThrow(new ExperimentIdNotFoundException(wrongExperimentID));
    });
  });

  describe('nameExists()', () => {
    let experiment: Experiment<Output>;
    let experimentEntity: ExperimentEntity;

    beforeEach(() => {
      experiment = createEmptyExperiment();
      experiment.name = 'test';
      experimentEntity = experimentToEntity(experiment);
    });

    it('positive - name should not exist in database for new experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(undefined);

      const result = await experimentsService.nameExists('random', 'new');

      expect(result).toBeFalsy();
    });

    it('negative - name should exist in database for new experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(experimentEntity);

      const result = await experimentsService.nameExists(experiment.name, 'new');

      expect(result).toBeTruthy();
    });

    it('positive - new name should not exist in database for existing experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(undefined);

      const result = await experimentsService.nameExists('random', experiment.id);

      expect(result).toBeFalsy();
    });

    it('negative - new name should exist in database for existing experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(experimentEntity);

      const result = await experimentsService.nameExists(experiment.name, experiment.id);

      expect(result).toBeTruthy();
    });
  });

  describe('ERP experiment', () => {
    let erp: ExperimentERP;
    let entityFromDB: ExperimentEntity;
    let erpEntityFromDB: ExperimentErpEntity;
    let erpOutputEntitiesFromDB: ExperimentErpOutputEntity[];

    beforeEach(() => {
      erp = createEmptyExperimentERP();
      erp.id = 1;
      erp.outputCount = 8;
      erp.outputs = new Array<number>(erp.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputERP(erp, index));
      entityFromDB = experimentToEntity(erp);
      erpEntityFromDB = experimentErpToEntity(erp);
      erpOutputEntitiesFromDB = erp.outputs.map((output: ErpOutput) => experimentErpOutputToEntity(output));
    });

    it('positive - should return one ERP experiment by id', async () => {
      const userGroups = [1];

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValueOnce(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValueOnce(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValueOnce([]);

      const result = await experimentsService.byId(userGroups, erp.id);

      expect(result).toEqual(erp);
    });

    it('positive - should insert new ERP experiment to database', () => {
      const userID = 0;
      erp.id = undefined;
      repositoryExperimentEntityMock.save.mockReturnValueOnce(entityFromDB);

      repositoryExperimentErpEntityMock.save.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => experimentsService.insert(erp, userID)).rejects.toThrowError();
    });

    it('positive - should delete existing ERP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValueOnce(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValueOnce(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValueOnce([]);

      const result = await experimentsService.delete(erp.id, erp.type);

      expect(repositoryExperimentErpEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });

    it('negative - should not delete non-existing experiment from database', () => {
      const experimentType: ExperimentType = ExperimentType.CVEP;

      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(undefined);

      expect(() => experimentsService.delete(erp.id, experimentType)).rejects.toThrow(new ExperimentIdNotFoundException(erp.id));
    })
  });

  describe('CVEP experiment', () => {
    let cvep: ExperimentCVEP;
    let entityFromDB: ExperimentEntity;
    let cvepEntityFromDB: ExperimentCvepEntity;
    let cvepOutputEntitiesFromDB: ExperimentCvepOutputEntity[];

    beforeEach(() => {
      cvep = createEmptyExperimentCVEP();
      cvep.id = 1;
      cvep.outputCount = 8;
      cvep.outputs = new Array<number>(cvep.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputCVEP(cvep, index));
      entityFromDB = experimentToEntity(cvep);
      cvepEntityFromDB = experimentCvepToEntity(cvep);
      cvepOutputEntitiesFromDB = cvep.outputs.map((output: CvepOutput) => experimentCvepOutputToEntity(output));
    });

    it('positive - should return one CVEP experiment by id', async () => {
      const userGroups = [1];

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValueOnce(cvepEntityFromDB);
      repositoryExperimentCvepOutputEntityMock.find.mockReturnValueOnce(cvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(userGroups, cvep.id);

      expect(result).toEqual(cvep);
    });

    it('positive - should insert new CVEP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      cvep.id = undefined;

      repositoryExperimentEntityMock.save.mockReturnValueOnce(entityFromDB);

      const result = await experimentsService.insert(cvep, userID);

      expect(repositoryExperimentCvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should delete existing CVEP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValueOnce(cvepEntityFromDB);
      repositoryExperimentCvepOutputEntityMock.find.mockReturnValueOnce(cvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(cvep.id, cvep.type);

      expect(repositoryExperimentCvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('FVEP experiment', () => {
    let fvep: ExperimentFVEP;
    let entityFromDB: ExperimentEntity;
    let fvepEntityFromDB: ExperimentFvepEntity;
    let fvepOutputEntitiesFromDB: ExperimentFvepOutputEntity[];

    beforeEach(() => {
      fvep = createEmptyExperimentFVEP();
      fvep.id = 1;
      fvep.outputCount = 8;
      fvep.outputs = new Array<number>(fvep.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputFVEP(fvep, index));
      entityFromDB = experimentToEntity(fvep);
      fvepEntityFromDB = experimentFvepToEntity(fvep);
      fvepOutputEntitiesFromDB = fvep.outputs.map((output: FvepOutput) => experimentFvepOutputToEntity(output));
    });

    it('positive - should return one FVEP experiment by id', async () => {
      const userGroups = [1];

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValueOnce(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValueOnce(fvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(userGroups, fvep.id);

      expect(result).toEqual(fvep);
    });

    it('positive - should insert new FVEP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      fvep.id = undefined;

      repositoryExperimentEntityMock.save.mockReturnValueOnce(entityFromDB);

      const result = await experimentsService.insert(fvep, userID);

      expect(repositoryExperimentFvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should delete existing FVEP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValueOnce(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValueOnce(fvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(fvep.id, fvep.type);

      expect(repositoryExperimentFvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('TVEP experiment', () => {
    let tvep: ExperimentTVEP;
    let entityFromDB: ExperimentEntity;
    let tvepEntityFromDB: ExperimentTvepEntity;
    let tvepOutputEntitiesFromDB: ExperimentTvepOutputEntity[];

    beforeEach(() => {
      tvep = createEmptyExperimentTVEP();
      tvep.id = 1;
      tvep.outputCount = 8;
      tvep.outputs = new Array<number>(tvep.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputTVEP(tvep, index));
      entityFromDB = experimentToEntity(tvep);
      tvepEntityFromDB = experimentTvepToEntity(tvep);
      tvepOutputEntitiesFromDB = tvep.outputs.map((output: TvepOutput) => experimentTvepOutputToEntity(output));
    });

    it('positive - should return one TVEP experiment by id', async () => {
      const userGroups = [1];

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValueOnce(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValueOnce(tvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(userGroups, tvep.id);

      expect(result).toEqual(tvep);
    });

    it('positive - should insert new TVEP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      tvep.id = undefined;

      repositoryExperimentEntityMock.save.mockReturnValueOnce(entityFromDB);

      const result = await experimentsService.insert(tvep, userID);

      expect(repositoryExperimentTvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should delete existing TVEP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValueOnce(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValueOnce(tvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(tvep.id, tvep.type);

      expect(repositoryExperimentTvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('REA experiment', () => {
    let rea: ExperimentREA;
    let entityFromDB: ExperimentEntity;
    let reaEntityFromDB: ExperimentReaEntity;
    let reaOutputEntitiesFromDB: ExperimentReaOutputEntity[];

    beforeEach(() => {
      rea = createEmptyExperimentREA();
      rea.id = 1;
      rea.outputCount = 8;
      rea.outputs = new Array<number>(rea.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputREA(rea, index));
      entityFromDB = experimentToEntity(rea);
      reaEntityFromDB = experimentReaToEntity(rea);
      reaOutputEntitiesFromDB = rea.outputs.map((output: ReaOutput) => experimentReaOutputToEntity(output));
    });

    it('positive - should return one REA experiment by id', async () => {
      const userGroups = [1];

      (repositoryExperimentEntityMock.createQueryBuilder() as unknown as MockType<SelectQueryBuilder<any>>).getOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValueOnce(reaEntityFromDB);
      repositoryExperimentReaOutputEntityMock.find.mockReturnValueOnce(reaOutputEntitiesFromDB);

      const result = await experimentsService.byId(userGroups, rea.id);

      expect(result).toEqual(rea);
    });

    it('positive - should insert new REA experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      rea.id = undefined;

      repositoryExperimentEntityMock.save.mockReturnValueOnce(entityFromDB);

      const result = await experimentsService.insert(rea, userID);

      expect(repositoryExperimentReaEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should delete existing REA experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValueOnce(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValueOnce(reaEntityFromDB);
      repositoryExperimentReaOutputEntityMock.find.mockReturnValueOnce(reaOutputEntitiesFromDB);

      const result = await experimentsService.delete(rea.id, rea.type);

      expect(repositoryExperimentReaEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });
});
