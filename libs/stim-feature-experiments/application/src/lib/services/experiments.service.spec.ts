import DoneCallback = jest.DoneCallback;
import { Test, TestingModule } from '@nestjs/testing';

import {
  createEmptyExperiment,
  createEmptyExperimentCVEP,
  createEmptyExperimentERP,
  createEmptyExperimentFVEP,
  createEmptyExperimentREA,
  createEmptyExperimentTVEP,
  createEmptyOutputERP,
  createEmptyOutputFVEP,
  createEmptyOutputTVEP,
  ErpOutput,
  Experiment,
  FvepOutput,
  TvepOutput,
} from '@stechy1/diplomka-share';

import {
  experimentCvepToEntity,
  experimentErpOutputToEntity,
  experimentErpToEntity,
  experimentFvepOutputToEntity,
  experimentFvepToEntity,
  experimentReaToEntity,
  experimentToEntity,
  experimentTvepOutputToEntity,
  experimentTvepToEntity,
  ExperimentEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentCvepEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
  ExperimentReaEntity,
  ExperimentIdNotFoundException,
} from '@diplomka-backend/stim-feature-experiments/domain';
import { ExperimentsService } from './experiments.service';
import {
  experimentRepositoryCvepProvider,
  experimentRepositoryErpProvider,
  experimentRepositoryFvepProvider,
  experimentRepositoryProvider,
  experimentRepositoryReaProvider,
  experimentRepositoryTvepProvider,
  repositoryExperimentCvepEntityMock,
  repositoryExperimentEntityMock,
  repositoryExperimentErpEntityMock,
  repositoryExperimentErpOutputDependencyEntityMock,
  repositoryExperimentErpOutputEntityMock,
  repositoryExperimentFvepEntityMock,
  repositoryExperimentFvepOutputEntityMock,
  repositoryExperimentReaEntityMock,
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
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      const entityFromDB: ExperimentEntity = experimentToEntity(experiment);

      repositoryExperimentEntityMock.find.mockReturnValue([entityFromDB]);

      const result = await experimentsService.findAll();

      expect(result).toEqual([experiment]);
    });
  });

  describe('byId()', () => {
    it('negative - should throw exception when not found', async (done: DoneCallback) => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(undefined);

      try {
        await experimentsService.byId(1, userID);
        done.fail('ExperimentIdNotFoundException was not thrown');
      } catch (e) {
        if (e instanceof ExperimentIdNotFoundException) {
          done();
        } else {
          done.fail('Unknown exception was thrown');
        }
      }
    });
  });

  describe('nameExists()', () => {
    let experiment: Experiment;
    let entity: ExperimentEntity;

    beforeEach(() => {
      experiment = createEmptyExperiment();
      experiment.name = 'test';
      entity = experimentToEntity(experiment);
    });

    it('positive - name should not exist in database for new experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(undefined);

      const result = await experimentsService.nameExists('random', 'new');

      expect(result).toBeFalsy();
    });

    it('negative - name should exist in database for new experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(experiment);

      const result = await experimentsService.nameExists(experiment.name, 'new');

      expect(result).toBeTruthy();
    });

    it('positive - new name should not exist in database for existing experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(undefined);

      const result = await experimentsService.nameExists('random', experiment.id);

      expect(result).toBeFalsy();
    });

    it('negative - new name should exist in database for existing experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(experiment);

      const result = await experimentsService.nameExists(experiment.name, experiment.id);

      expect(result).toBeTruthy();
    });
  });

  describe('ERP experiment', () => {
    let erp;
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
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);

      const result = await experimentsService.byId(erp.id, userID);

      expect(result).toEqual(erp);
    });

    it('positive - should insert new ERP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      erp.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({ raw: expectedID });

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);

      const result = await experimentsService.insert(erp, userID);

      expect(repositoryExperimentErpEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    // it('positive - should update existing ERP experiment in database', async () => {
    //   repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
    //   repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
    //   repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
    //   repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);
    //
    //   const result = await experimentsService.update(erp);
    //
    //   expect(repositoryExperimentErpEntityMock.update).toBeCalled();
    //   expect(result).toEqual(erp);
    // });

    it('positive - should delete existing ERP experiment from database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);

      const result = await experimentsService.delete(erp.id, userID);

      expect(repositoryExperimentErpEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('CVEP experiment', () => {
    let cvep;
    let entityFromDB: ExperimentEntity;
    let cvepEntityFromDB: ExperimentCvepEntity;

    beforeEach(() => {
      cvep = createEmptyExperimentCVEP();
      cvep.id = 1;
      cvep.outputCount = 8;
      entityFromDB = experimentToEntity(cvep);
      cvepEntityFromDB = experimentCvepToEntity(cvep);
    });

    it('positive - should return one CVEP experiment by id', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.byId(cvep.id, userID);

      expect(result).toEqual(cvep);
    });

    it('positive - should insert new CVEP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      cvep.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({ raw: expectedID });

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.insert(cvep, userID);

      expect(repositoryExperimentCvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should update existing CVEP experiment in database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.update(cvep, userID);

      expect(repositoryExperimentCvepEntityMock.update).toBeCalled();
      expect(result).toEqual(undefined);
    });

    it('positive - should delete existing CVEP experiment from database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.delete(cvep.id, userID);

      expect(repositoryExperimentCvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('FVEP experiment', () => {
    let fvep;
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
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(fvep.id, userID);

      expect(result).toEqual(fvep);
    });

    it('positive - should insert new FVEP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      fvep.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({ raw: expectedID });

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);

      const result = await experimentsService.insert(fvep, userID);

      expect(repositoryExperimentFvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should delete existing FVEP experiment from database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(fvep.id, userID);

      expect(repositoryExperimentFvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('TVEP experiment', () => {
    let tvep;
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
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(tvep.id, userID);

      expect(result).toEqual(tvep);
    });

    it('positive - should insert new TVEP experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      tvep.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({ raw: expectedID });

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);

      const result = await experimentsService.insert(tvep, userID);

      expect(repositoryExperimentTvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should delete existing TVEP experiment from database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(tvep.id, userID);

      expect(repositoryExperimentTvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });

  describe('REA experiment', () => {
    let rea;
    let entityFromDB: ExperimentEntity;
    let reaEntityFromDB: ExperimentReaEntity;

    beforeEach(() => {
      rea = createEmptyExperimentREA();
      rea.id = 1;
      rea.outputCount = 8;
      entityFromDB = experimentToEntity(rea);
      reaEntityFromDB = experimentReaToEntity(rea);
    });

    it('positive - should return one REA experiment by id', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.byId(rea.id, userID);

      expect(result).toEqual(rea);
    });

    it('positive - should insert new REA experiment to database', async () => {
      const expectedID = 1;
      const userID = 0;
      rea.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({ raw: expectedID });

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.insert(rea, userID);

      expect(repositoryExperimentReaEntityMock.insert).toBeCalled();
      expect(result).toEqual(expectedID);
    });

    it('positive - should update existing REA experiment in database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.update(rea, userID);

      expect(repositoryExperimentReaEntityMock.update).toBeCalled();
      expect(result).toEqual(undefined);
    });

    it('positive - should delete existing REA experiment from database', async () => {
      const userID = 0;

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.delete(rea.id, userID);

      expect(repositoryExperimentReaEntityMock.delete).toBeCalled();
      expect(result).toEqual(undefined);
    });
  });
});
