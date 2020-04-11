import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExperimentsService } from '../../src/experiments/experiments.service';
import { ExperimentRepository } from '../../src/experiments/repository/experiment.repository';
import { ExperimentsModule } from '../../src/experiments/experiments.module';
import { generalCustomExperimentRepositoryMockFactory, generalExperimentRepositoryMockFactory, MockType } from '../test-helpers';
import { initDbTriggers } from '../../src/db-setup';
import {
  createEmptyExperimentCVEP,
  createEmptyExperimentERP,
  createEmptyExperimentFVEP, createEmptyExperimentREA,
  createEmptyExperimentTVEP,
} from '@stechy1/diplomka-share/lib/experiments';
import { ExperimentErpRepository } from '../../src/experiments/repository/experiment-erp.repository';
import { ExperimentCvepRepository } from '../../src/experiments/repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from '../../src/experiments/repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from '../../src/experiments/repository/experiment-tvep.repository';
import { ExperimentReaRepository } from '../../src/experiments/repository/experiment-rea.repository';

describe('Experiments service', () => {
  let testingModule: TestingModule;
  let experimentsService: ExperimentsService;

  let experimentRepository: MockType<ExperimentRepository>;
  let experimentErpRepository: MockType<ExperimentErpRepository>;
  let experimentCvepRepository: MockType<ExperimentCvepRepository>;
  let experimentFvepRepository: MockType<ExperimentFvepRepository>;
  let experimentTvepRepository: MockType<ExperimentTvepRepository>;
  let experimentReaRepository: MockType<ExperimentReaRepository>;
  //
  // let experimentEntityMock: MockType<Repository<ExperimentEntity>>;
  // let experimentErpEntityMock: MockType<Repository<ExperimentErpEntity>>;
  // let experimentErpOutputEntityMock: MockType<Repository<ExperimentErpOutputEntity>>;
  // let experimentErpOutputDependencyEntityMock: MockType<Repository<ExperimentErpOutputDependencyEntity>>;
  // let experimentCvepEntityMock: MockType<Repository<ExperimentCvepEntity>>;
  // let experimentFvepEntityMock: MockType<Repository<ExperimentFvepEntity>>;
  // let experimentFvepOutputEntityMock: MockType<Repository<ExperimentFvepOutputEntity>>;
  // let experimentTvepEntityMock: MockType<Repository<ExperimentTvepEntity>>;
  // let experimentTvepOutputEntityMock: MockType<Repository<ExperimentTvepOutputEntity>>;

  // let experimentRepositoryMock: MockType<ExperimentRepository>;
  // let experimentErpRepositoryMock: MockType<ExperimentErpRepository>;
  // let experimentErpOutputRepositoryMock: MockType<Repository<ExperimentErpOutputEntity>>;
  // let experimentErpOutputDependencyRepositoryMock: MockType<Repository<ExperimentErpOutputDependencyEntity>>;
  // let experimentCvepRepositoryMock: MockType<ExperimentCvepRepository>;
  // let experimentFvepRepositoryMock: MockType<ExperimentFvepRepository>;
  // let experimentFvepOutputRepositoryMock: MockType<Repository<ExperimentFvepOutputEntity>>;
  // let experimentTvepRepositoryMock: MockType<ExperimentTvepRepository>;
  // let experimentTvepOutputRepositoryMock: MockType<Repository<ExperimentTvepOutputEntity>>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
          keepConnectionAlive: true
        }),
        ExperimentsModule
      ]
    })
                              .overrideProvider(ExperimentRepository)
                              .useFactory({factory: generalExperimentRepositoryMockFactory})
                              .overrideProvider(ExperimentErpRepository)
                              .useFactory({factory: generalCustomExperimentRepositoryMockFactory})
                              .overrideProvider(ExperimentCvepRepository)
                              .useFactory({factory: generalCustomExperimentRepositoryMockFactory})
                              .overrideProvider(ExperimentFvepRepository)
                              .useFactory({factory: generalCustomExperimentRepositoryMockFactory})
                              .overrideProvider(ExperimentTvepRepository)
                              .useFactory({factory: generalCustomExperimentRepositoryMockFactory})
                              .overrideProvider(ExperimentReaRepository)
                              .useFactory({factory: generalCustomExperimentRepositoryMockFactory})

                              // .overrideProvider(getRepositoryToken(ExperimentEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentErpEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentErpOutputEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentErpOutputDependencyEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentCvepEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentFvepEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentFvepOutputEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentTvepEntity))
                              // .useValue(generalRepositoryMockFactory)
                              // .overrideProvider(getRepositoryToken(ExperimentTvepOutputEntity))
                              // .useValue(generalRepositoryMockFactory)
                              .compile();

    await initDbTriggers(null);
    experimentsService = testingModule.get<ExperimentsService>(ExperimentsService);
    experimentsService.registerMessagePublisher(() => {});

    experimentRepository = testingModule.get(ExperimentRepository);
    experimentErpRepository = testingModule.get(ExperimentErpRepository);
    experimentCvepRepository = testingModule.get(ExperimentCvepRepository);
    experimentFvepRepository = testingModule.get(ExperimentFvepRepository);
    experimentTvepRepository = testingModule.get(ExperimentTvepRepository);
    experimentReaRepository = testingModule.get(ExperimentReaRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(experimentsService).toBeDefined();
  });

  describe('all()', () => {
    it('should return all available experiments',  async () => {
      const erp = createEmptyExperimentERP();

      experimentRepository.all.mockImplementationOnce(() => [erp]);

      await experimentsService.findAll();

      expect(experimentRepository.all).toBeCalled();
      expect(experimentRepository.all).toReturnWith([erp]);
    });
  });

  describe('insert()',  () => {

    it('should insert new ERP experiment', async () => {
      const experiment = createEmptyExperimentERP();

      const experimentID = 1;

      experimentRepository.all.mockReturnValue([]);
      await experimentsService.findAll();
      expect(experimentRepository.all).toReturnWith([]);

      experimentRepository.insert.mockImplementationOnce(() => ({raw: experimentID}));
      experimentRepository.one.mockImplementationOnce(() => experiment);
      experimentErpRepository.one.mockImplementationOnce(() => experiment);

      const insertedExperiment = await experimentsService.insert(experiment);

      expect(experimentRepository.insert).toBeCalledWith(experiment);
      expect(experimentRepository.insert).toReturnWith({raw: experimentID});
      expect(experimentErpRepository.insert).toBeCalledWith(experiment);
      expect(experimentErpRepository.one).toBeCalledWith(experiment);
      expect(experimentErpRepository.one).toReturnWith(insertedExperiment);
    });

    it('should insert new CVEP experiment', async () => {
      const experiment = createEmptyExperimentCVEP();

      const experimentID = 1;

      experimentRepository.all.mockReturnValue([]);
      await experimentsService.findAll();
      expect(experimentRepository.all).toReturnWith([]);

      experimentRepository.insert.mockImplementationOnce(() => ({raw: experimentID}));
      experimentRepository.one.mockImplementationOnce(() => experiment);
      experimentCvepRepository.one.mockImplementationOnce(() => experiment);

      const insertedExperiment = await experimentsService.insert(experiment);

      expect(experimentRepository.insert).toBeCalledWith(experiment);
      expect(experimentRepository.insert).toReturnWith({raw: experimentID});
      expect(experimentCvepRepository.insert).toBeCalledWith(experiment);
      expect(experimentCvepRepository.one).toBeCalledWith(experiment);
      expect(experimentCvepRepository.one).toReturnWith(insertedExperiment);
    });

    it('should insert new FVEP experiment', async () => {
      const experiment = createEmptyExperimentFVEP();

      const experimentID = 1;

      experimentRepository.all.mockReturnValue([]);
      await experimentsService.findAll();
      expect(experimentRepository.all).toReturnWith([]);

      experimentRepository.insert.mockImplementationOnce(() => ({raw: experimentID}));
      experimentRepository.one.mockImplementationOnce(() => experiment);
      experimentFvepRepository.one.mockImplementationOnce(() => experiment);

      const insertedExperiment = await experimentsService.insert(experiment);

      expect(experimentRepository.insert).toBeCalledWith(experiment);
      expect(experimentRepository.insert).toReturnWith({raw: experimentID});
      expect(experimentFvepRepository.insert).toBeCalledWith(experiment);
      expect(experimentFvepRepository.one).toBeCalledWith(experiment);
      expect(experimentFvepRepository.one).toReturnWith(insertedExperiment);
    });

    it('should insert new TVEP experiment', async () => {
      const experiment = createEmptyExperimentTVEP();

      const experimentID = 1;

      experimentRepository.all.mockReturnValue([]);
      await experimentsService.findAll();
      expect(experimentRepository.all).toReturnWith([]);

      experimentRepository.insert.mockImplementationOnce(() => ({raw: experimentID}));
      experimentRepository.one.mockImplementationOnce(() => experiment);
      experimentTvepRepository.one.mockImplementationOnce(() => experiment);

      const insertedExperiment = await experimentsService.insert(experiment);

      expect(experimentRepository.insert).toBeCalledWith(experiment);
      expect(experimentRepository.insert).toReturnWith({raw: experimentID});
      expect(experimentTvepRepository.insert).toBeCalledWith(experiment);
      expect(experimentTvepRepository.one).toBeCalledWith(experiment);
      expect(experimentTvepRepository.one).toReturnWith(insertedExperiment);
    });

    it('should insert new REA experiment', async () => {
      const experiment = createEmptyExperimentREA();

      const experimentID = 1;

      experimentRepository.all.mockReturnValue([]);
      await experimentsService.findAll();
      expect(experimentRepository.all).toReturnWith([]);

      experimentRepository.insert.mockImplementationOnce(() => ({raw: experimentID}));
      experimentRepository.one.mockImplementationOnce(() => experiment);
      experimentReaRepository.one.mockImplementationOnce(() => experiment);

      const insertedExperiment = await experimentsService.insert(experiment);

      expect(experimentRepository.insert).toBeCalledWith(experiment);
      expect(experimentRepository.insert).toReturnWith({raw: experimentID});
      expect(experimentReaRepository.insert).toBeCalledWith(experiment);
      expect(experimentReaRepository.one).toBeCalledWith(experiment);
      expect(experimentReaRepository.one).toReturnWith(insertedExperiment);
    });

    // test.each`
    //         experiment                    | repository                 | type
    //         ${createEmptyExperimentERP()} | ${experimentErpRepository} | ${ExperimentType[ExperimentType.ERP]}
    // `('should insert new $type experiment.', async ({experiment, repository, type}) => {
    //   const experimentID = 1;
    //   console.log(experiment);
    //
    //   experimentRepository.all.mockReturnValue([]);
    //   await experimentsService.findAll();
    //   expect(experimentRepository.all).toReturnWith([]);
    //
    //   experimentRepository.insert.mockImplementationOnce(() => ({raw: experimentID}));
    //   experimentRepository.one.mockImplementationOnce(() => experiment);
    //   repository.one.mockImplementationOnce(() => experiment);
    //
    //   const insertedExperiment = await experimentsService.insert(experiment);
    //
    //   expect(experimentRepository.insert).toBeCalledWith(experiment);
    //   expect(experimentRepository.insert).toReturnWith({raw: experimentID});
    //   expect(repository.insert).toBeCalledWith(experiment);
    //   expect(repository.one).toBeCalledWith(experiment);
    //   expect(repository.one).toReturnWith(insertedExperiment);
    // });

  });
});
