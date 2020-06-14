import { ExperimentRepository } from './repository/experiment.repository';
import {
  createRepositoryMock,
  MockType,
} from 'apps/server/src/app/test-helpers';
import { ObjectType, Repository } from 'typeorm';
import { ExperimentEntity } from './model/entity/experiment.entity';
import { ExperimentErpEntity } from './model/entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from './model/entity/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './model/entity/experiment-erp-output-dependency.entity';
import { ExperimentCvepEntity } from './model/entity/experiment-cvep.entity';
import { ExperimentFvepEntity } from './model/entity/experiment-fvep.entity';
import { ExperimentFvepOutputEntity } from './model/entity/experiment-fvep-output.entity';
import { ExperimentTvepEntity } from './model/entity/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from './model/entity/experiment-tvep-output.entity';
import { ExperimentReaEntity } from './model/entity/experiment-rea.entity';
import { ExperimentErpRepository } from './repository/experiment-erp.repository';
import { ExperimentCvepRepository } from './repository/experiment-cvep.repository';
import { ExperimentFvepRepository } from './repository/experiment-fvep.repository';
import { ExperimentTvepRepository } from './repository/experiment-tvep.repository';
import { ExperimentReaRepository } from './repository/experiment-rea.repository';

export const repositoryExperimentEntityMock: MockType<Repository<
  ExperimentEntity
>> = createRepositoryMock();
export const repositoryExperimentErpEntityMock: MockType<Repository<
  ExperimentErpEntity
>> = createRepositoryMock();
export const repositoryExperimentErpOutputEntityMock: MockType<Repository<
  ExperimentErpOutputEntity
>> = createRepositoryMock();
export const repositoryExperimentErpOutputDependencyEntityMock: MockType<Repository<
  ExperimentErpOutputDependencyEntity
>> = createRepositoryMock();
export const repositoryExperimentCvepEntityMock: MockType<Repository<
  ExperimentCvepEntity
>> = createRepositoryMock();
export const repositoryExperimentFvepEntityMock: MockType<Repository<
  ExperimentFvepEntity
>> = createRepositoryMock();
export const repositoryExperimentFvepOutputEntityMock: MockType<Repository<
  ExperimentFvepOutputEntity
>> = createRepositoryMock();
export const repositoryExperimentTvepEntityMock: MockType<Repository<
  ExperimentTvepEntity
>> = createRepositoryMock();
export const repositoryExperimentTvepOutputEntityMock: MockType<Repository<
  ExperimentTvepOutputEntity
>> = createRepositoryMock();
export const repositoryExperimentReaEntityMock: MockType<Repository<
  ExperimentReaEntity
>> = createRepositoryMock();

export const erpRepositoryToEntityMapper = (entity: ObjectType<any>) => {
  switch (entity) {
    case ExperimentErpEntity:
      return repositoryExperimentErpEntityMock;
    case ExperimentErpOutputEntity:
      return repositoryExperimentErpOutputEntityMock;
    case ExperimentErpOutputDependencyEntity:
      return repositoryExperimentErpOutputDependencyEntityMock;
  }
};
export const fvepRepositoryToEntityMapper = (entity: ObjectType<any>) => {
  switch (entity) {
    case ExperimentFvepEntity:
      return repositoryExperimentFvepEntityMock;
    case ExperimentFvepOutputEntity:
      return repositoryExperimentFvepOutputEntityMock;
  }
};
export const tvepRepositoryToEntityMapper = (entity: ObjectType<any>) => {
  switch (entity) {
    case ExperimentTvepEntity:
      return repositoryExperimentTvepEntityMock;
    case ExperimentTvepOutputEntity:
      return repositoryExperimentTvepOutputEntityMock;
  }
};

export const experimentRepositoryProvider = {
  provide: ExperimentRepository,
  // @ts-ignore
  useValue: new ExperimentRepository({
    getRepository: () => repositoryExperimentEntityMock,
  }),
};

export const experimentRepositoryErpProvider = {
  provide: ExperimentErpRepository,
  useValue: new ExperimentErpRepository({
    // @ts-ignore
    getRepository: erpRepositoryToEntityMapper,
    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable
    transaction: ({ getRepository: erpRepositoryToEntityMapper }) => {},
  }),
};

export const experimentRepositoryCvepProvider = {
  provide: ExperimentCvepRepository,
  // @ts-ignore
  useValue: new ExperimentCvepRepository({
    getRepository: () => repositoryExperimentCvepEntityMock,
  }),
};

export const experimentRepositoryFvepProvider = {
  provide: ExperimentFvepRepository,
  // @ts-ignore
  useValue: new ExperimentFvepRepository({
    // @ts-ignore
    getRepository: fvepRepositoryToEntityMapper,
    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable
    transaction: ({ getRepository: fvepRepositoryToEntityMapper }) => {},
  }),
};

export const experimentRepositoryTvepProvider = {
  provide: ExperimentTvepRepository,
  // @ts-ignore
  useValue: new ExperimentTvepRepository({
    // @ts-ignore
    getRepository: tvepRepositoryToEntityMapper,
    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable
    transaction: ({ getRepository: tvepRepositoryToEntityMapper }) => {},
  }),
};

export const experimentRepositoryReaProvider = {
  provide: ExperimentReaRepository,
  // @ts-ignore
  useValue: new ExperimentReaRepository({
    getRepository: () => repositoryExperimentReaEntityMock,
  }),
};
