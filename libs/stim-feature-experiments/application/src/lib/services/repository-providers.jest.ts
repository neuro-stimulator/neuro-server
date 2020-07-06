import { ObjectType, Repository } from 'typeorm';

import { createRepositoryMock, MockType } from 'test-helpers/test-helpers';

import {
  ExperimentEntity,
  ExperimentErpEntity,
  ExperimentErpOutputEntity,
  ExperimentErpOutputDependencyEntity,
  ExperimentCvepEntity,
  ExperimentFvepEntity,
  ExperimentFvepOutputEntity,
  ExperimentTvepEntity,
  ExperimentTvepOutputEntity,
  ExperimentReaEntity,
  ExperimentRepository,
  ExperimentErpRepository,
  ExperimentCvepRepository,
  ExperimentFvepRepository,
  ExperimentTvepRepository,
  ExperimentReaRepository,
} from '@diplomka-backend/stim-feature-experiments/domain';

export const repositoryExperimentEntityMock: MockType<Repository<ExperimentEntity>> = createRepositoryMock();
export const repositoryExperimentErpEntityMock: MockType<Repository<ExperimentErpEntity>> = createRepositoryMock();
export const repositoryExperimentErpOutputEntityMock: MockType<Repository<ExperimentErpOutputEntity>> = createRepositoryMock();
export const repositoryExperimentErpOutputDependencyEntityMock: MockType<Repository<ExperimentErpOutputDependencyEntity>> = createRepositoryMock();
export const repositoryExperimentCvepEntityMock: MockType<Repository<ExperimentCvepEntity>> = createRepositoryMock();
export const repositoryExperimentFvepEntityMock: MockType<Repository<ExperimentFvepEntity>> = createRepositoryMock();
export const repositoryExperimentFvepOutputEntityMock: MockType<Repository<ExperimentFvepOutputEntity>> = createRepositoryMock();
export const repositoryExperimentTvepEntityMock: MockType<Repository<ExperimentTvepEntity>> = createRepositoryMock();
export const repositoryExperimentTvepOutputEntityMock: MockType<Repository<ExperimentTvepOutputEntity>> = createRepositoryMock();
export const repositoryExperimentReaEntityMock: MockType<Repository<ExperimentReaEntity>> = createRepositoryMock();

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
  useValue: new ExperimentRepository({
    // @ts-ignore
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
  useValue: new ExperimentCvepRepository({
    // @ts-ignore
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
  useValue: new ExperimentReaRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentReaEntityMock,
  }),
};
