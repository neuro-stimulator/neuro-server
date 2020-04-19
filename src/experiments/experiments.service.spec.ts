import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  createEmptyExperiment,
  createEmptyExperimentCVEP,
  createEmptyExperimentERP,
  createEmptyExperimentFVEP, createEmptyExperimentREA, createEmptyExperimentTVEP,
  createEmptyOutputERP,
  createEmptyOutputFVEP, createEmptyOutputTVEP,
  ErpOutput,
  Experiment,
  FvepOutput,
  TvepOutput,
} from '@stechy1/diplomka-share';
import { ExperimentsService } from './experiments.service';
import { initDbTriggers } from '../db-setup';
import { ExperimentEntity } from './entity/experiment.entity';
import { ExperimentErpEntity } from './entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from './entity/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './entity/experiment-erp-output-dependency.entity';
import { ExperimentCvepEntity } from './entity/experiment-cvep.entity';
import { ExperimentFvepEntity } from './entity/experiment-fvep.entity';
import { ExperimentFvepOutputEntity } from './entity/experiment-fvep-output.entity';
import { ExperimentTvepEntity } from './entity/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from './entity/experiment-tvep-output.entity';
import { SerialService } from '../low-level/serial.service';
import { ExperimentReaEntity } from './entity/experiment-rea.entity';
import {
  experimentCvepToEntity,
  experimentErpOutputToEntity,
  experimentErpToEntity, experimentFvepOutputToEntity,
  experimentFvepToEntity, experimentReaToEntity,
  experimentToEntity, experimentTvepOutputToEntity, experimentTvepToEntity,
} from './experiments.mapping';
import { TOTAL_OUTPUT_COUNT } from '../config/config';
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
} from './repository-providers';

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
        {provide: SerialService, useFactory: () => jest.fn()},
      ],
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: ['src/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
          keepConnectionAlive: true
        }),
        TypeOrmModule.forFeature([
          ExperimentEntity,
          ExperimentErpEntity,
          ExperimentErpOutputEntity,
          ExperimentErpOutputDependencyEntity,
          ExperimentCvepEntity,
          ExperimentFvepEntity,
          ExperimentFvepOutputEntity,
          ExperimentTvepEntity,
          ExperimentTvepOutputEntity,
          ExperimentReaEntity
        ]),
      ]
    }).compile();

    await initDbTriggers(null);
    experimentsService = testingModule.get<ExperimentsService>(ExperimentsService);
    experimentsService.registerMessagePublisher(jest.fn());

  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(experimentsService).toBeDefined();
  });

  describe('all()', () => {
    it('positive - should return all available experiments',  async () => {
      const experiment: Experiment = createEmptyExperiment();
      experiment.id = 1;
      const entityFromDB: ExperimentEntity = experimentToEntity(experiment);

      repositoryExperimentEntityMock.find.mockReturnValue([entityFromDB]);

      const result = await experimentsService.findAll();

      expect(result).toEqual([experiment]);
    });
  });

  describe('byId()', () => {
    it('positive - should not return any experiment', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(undefined);

      const result = await experimentsService.byId(1);

      expect(result).toBeUndefined();
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
      erp.outputCount = TOTAL_OUTPUT_COUNT;
      erp.outputs = new Array<number>(erp.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputERP(erp, index));
      entityFromDB = experimentToEntity(erp);
      erpEntityFromDB = experimentErpToEntity(erp);
      erpOutputEntitiesFromDB = erp.outputs.map((output: ErpOutput) => experimentErpOutputToEntity(output));
    });

    it('positive - should return one ERP experiment by id', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);

      const result = await experimentsService.byId(erp.id);

      expect(result).toEqual(erp);
    });

    it('positive - should insert new ERP experiment to database', async () => {
      erp.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({raw: 1});

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);

      const result = await experimentsService.insert(erp);

      expect(repositoryExperimentErpEntityMock.insert).toBeCalled();
      expect(result).toEqual(erp);
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
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentErpEntityMock.findOne.mockReturnValue(erpEntityFromDB);
      repositoryExperimentErpOutputEntityMock.find.mockReturnValue(erpOutputEntitiesFromDB);
      repositoryExperimentErpOutputDependencyEntityMock.find.mockReturnValue([]);

      const result = await experimentsService.delete(erp.id);

      expect(repositoryExperimentErpEntityMock.delete).toBeCalled();
      expect(result).toEqual(erp);
    });

    it('positive - should validate ERP experiment', async () => {
      erp.name = 'test';
      expect(await experimentsService.validateExperiment(erp)).toBeTruthy();
    });
  });

  describe('CVEP experiment', () => {
    let cvep;
    let entityFromDB: ExperimentEntity;
    let cvepEntityFromDB: ExperimentCvepEntity;

    beforeEach(() => {
      cvep = createEmptyExperimentCVEP();
      cvep.id = 1;
      cvep.outputCount = TOTAL_OUTPUT_COUNT;
      entityFromDB = experimentToEntity(cvep);
      cvepEntityFromDB = experimentCvepToEntity(cvep);
    });

    it('positive - should return one CVEP experiment by id', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.byId(cvep.id);

      expect(result).toEqual(cvep);
    });

    it('positive - should insert new CVEP experiment to database', async () => {
      cvep.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({raw: 1});

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.insert(cvep);

      expect(repositoryExperimentCvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(cvep);
    });

    it('positive - should update existing CVEP experiment in database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.update(cvep);

      expect(repositoryExperimentCvepEntityMock.update).toBeCalled();
      expect(result).toEqual(cvep);
    });

    it('positive - should delete existing CVEP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentCvepEntityMock.findOne.mockReturnValue(cvepEntityFromDB);

      const result = await experimentsService.delete(cvep.id);

      expect(repositoryExperimentCvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(cvep);
    });

    it('positive - should validate CVEP experiment', async () => {
      cvep.name = 'test';
      expect(await experimentsService.validateExperiment(cvep)).toBeTruthy();
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
      fvep.outputCount = TOTAL_OUTPUT_COUNT;
      fvep.outputs = new Array<number>(fvep.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputFVEP(fvep, index));
      entityFromDB = experimentToEntity(fvep);
      fvepEntityFromDB = experimentFvepToEntity(fvep);
      fvepOutputEntitiesFromDB = fvep.outputs.map((output: FvepOutput) => experimentFvepOutputToEntity(output));
    });

    it('positive - should return one FVEP experiment by id', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(fvep.id);

      expect(result).toEqual(fvep);
    });

    it('positive - should insert new FVEP experiment to database', async () => {
      fvep.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({raw: 1});

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);

      const result = await experimentsService.insert(fvep);

      expect(repositoryExperimentFvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(fvep);
    });

    // it('positive - should update existing FVEP experiment in database', async () => {
    //   repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
    //   repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
    //   repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);
    //
    //   const result = await experimentsService.update(fvep);
    //
    //   expect(repositoryExperimentFvepEntityMock.update).toBeCalled();
    //   expect(result).toEqual(fvep);
    // });

    it('positive - should delete existing FVEP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentFvepEntityMock.findOne.mockReturnValue(fvepEntityFromDB);
      repositoryExperimentFvepOutputEntityMock.find.mockReturnValue(fvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(fvep.id);

      expect(repositoryExperimentFvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(fvep);
    });

    it('positive - should validate FVEP experiment', async () => {
      fvep.name = 'test';
      expect(await experimentsService.validateExperiment(fvep)).toBeTruthy();
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
      tvep.outputCount = TOTAL_OUTPUT_COUNT;
      tvep.outputs = new Array<number>(tvep.outputCount).fill(0).map((value: number, index: number) => createEmptyOutputTVEP(tvep, index));
      entityFromDB = experimentToEntity(tvep);
      tvepEntityFromDB = experimentTvepToEntity(tvep);
      tvepOutputEntitiesFromDB = tvep.outputs.map((output: TvepOutput) => experimentTvepOutputToEntity(output));
    });

    it('positive - should return one TVEP experiment by id', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);

      const result = await experimentsService.byId(tvep.id);

      expect(result).toEqual(tvep);
    });

    it('positive - should insert new TVEP experiment to database', async () => {
      tvep.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({raw: 1});

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);

      const result = await experimentsService.insert(tvep);

      expect(repositoryExperimentTvepEntityMock.insert).toBeCalled();
      expect(result).toEqual(tvep);
    });

    // it('positive - should update existing TVEP experiment in database', async () => {
    //   repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
    //   repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
    //   repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);
    //
    //   const result = await experimentsService.update(tvep);
    //
    //   expect(repositoryExperimentTvepEntityMock.update).toBeCalled();
    //   expect(result).toEqual(tvep);
    // });

    it('positive - should delete existing TVEP experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentTvepEntityMock.findOne.mockReturnValue(tvepEntityFromDB);
      repositoryExperimentTvepOutputEntityMock.find.mockReturnValue(tvepOutputEntitiesFromDB);

      const result = await experimentsService.delete(tvep.id);

      expect(repositoryExperimentTvepEntityMock.delete).toBeCalled();
      expect(result).toEqual(tvep);
    });

    it('positive - should validate TVEP experiment', async () => {
      tvep.name = 'test';
      expect(await experimentsService.validateExperiment(tvep)).toBeTruthy();
    });
  });

  describe('REA experiment', () => {
    let rea;
    let entityFromDB: ExperimentEntity;
    let reaEntityFromDB: ExperimentReaEntity;

    beforeEach(() => {
      rea = createEmptyExperimentREA();
      rea.id = 1;
      rea.outputCount = TOTAL_OUTPUT_COUNT;
      entityFromDB = experimentToEntity(rea);
      reaEntityFromDB = experimentReaToEntity(rea);
    });

    it('positive - should return one REA experiment by id', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.byId(rea.id);

      expect(result).toEqual(rea);
    });

    it('positive - should insert new REA experiment to database', async () => {
      rea.id = undefined;
      repositoryExperimentEntityMock.insert.mockReturnValue({raw: 1});

      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.insert(rea);

      expect(repositoryExperimentReaEntityMock.insert).toBeCalled();
      expect(result).toEqual(rea);
    });

    it('positive - should update existing REA experiment in database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.update(rea);

      expect(repositoryExperimentReaEntityMock.update).toBeCalled();
      expect(result).toEqual(rea);
    });

    it('positive - should delete existing REA experiment from database', async () => {
      repositoryExperimentEntityMock.findOne.mockReturnValue(entityFromDB);
      repositoryExperimentReaEntityMock.findOne.mockReturnValue(reaEntityFromDB);

      const result = await experimentsService.delete(rea.id);

      expect(repositoryExperimentReaEntityMock.delete).toBeCalled();
      expect(result).toEqual(rea);
    });

    it('positive - should validate REA experiment', async () => {
      rea.name = 'test';
      expect(await experimentsService.validateExperiment(rea)).toBeTruthy();
    });
  });

});
