import { ObjectType } from 'typeorm';

import { Provider } from '@nestjs/common';

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
  ExperimentCvepOutputEntity,
  ExperimentReaOutputEntity,
} from '@neuro-server/stim-feature-experiments/domain';

import { createRepositoryMock, RepositoryMockType } from 'test-helpers/test-helpers';

export const repositoryExperimentEntityMock: RepositoryMockType<ExperimentEntity> = createRepositoryMock();
export const repositoryExperimentErpEntityMock: RepositoryMockType<ExperimentErpEntity> = createRepositoryMock();
export const repositoryExperimentErpOutputEntityMock: RepositoryMockType<ExperimentErpOutputEntity> = createRepositoryMock();
export const repositoryExperimentErpOutputDependencyEntityMock: RepositoryMockType<ExperimentErpOutputDependencyEntity> = createRepositoryMock();
export const repositoryExperimentCvepEntityMock: RepositoryMockType<ExperimentCvepEntity> = createRepositoryMock();
export const repositoryExperimentCvepOutputEntityMock: RepositoryMockType<ExperimentCvepOutputEntity> = createRepositoryMock();
export const repositoryExperimentFvepEntityMock: RepositoryMockType<ExperimentFvepEntity> = createRepositoryMock();
export const repositoryExperimentFvepOutputEntityMock: RepositoryMockType<ExperimentFvepOutputEntity> = createRepositoryMock();
export const repositoryExperimentTvepEntityMock: RepositoryMockType<ExperimentTvepEntity> = createRepositoryMock();
export const repositoryExperimentTvepOutputEntityMock: RepositoryMockType<ExperimentTvepOutputEntity> = createRepositoryMock();
export const repositoryExperimentReaEntityMock: RepositoryMockType<ExperimentReaEntity> = createRepositoryMock();
export const repositoryExperimentReaOutputEntityMock: RepositoryMockType<ExperimentReaOutputEntity> = createRepositoryMock();

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
export const cvepRepositoryToEntityMapper = (entity: ObjectType<any>) => {
  switch (entity) {
    case ExperimentCvepEntity:
      return repositoryExperimentCvepEntityMock;
    case ExperimentCvepOutputEntity:
      return repositoryExperimentCvepOutputEntityMock;
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
export const reaRepositoryToEntityMapper = (entity: ObjectType<any>) => {
  switch (entity) {
    case ExperimentReaEntity:
      return repositoryExperimentReaEntityMock;
    case ExperimentReaOutputEntity:
      return repositoryExperimentReaOutputEntityMock;
  }
};

export const experimentRepositoryProvider: Provider = {
  provide: ExperimentRepository,
  useValue: new ExperimentRepository({
    // @ts-ignore
    getRepository: () => repositoryExperimentEntityMock,
  }),
};

export const experimentRepositoryErpProvider: Provider = {
  provide: ExperimentErpRepository,
  useValue: new ExperimentErpRepository({
    // @ts-ignore
    getRepository: erpRepositoryToEntityMapper,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    transaction: ({ getRepository: erpRepositoryToEntityMapper }) => {
      // this function must be empty
    },
  }),
};

export const experimentRepositoryCvepProvider: Provider = {
  provide: ExperimentCvepRepository,
  useValue: new ExperimentCvepRepository({
    // @ts-ignore
    getRepository: cvepRepositoryToEntityMapper,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    transaction: ({ getRepository: cvepRepositoryToEntityMapper }) => {
      // this function must be empty
    },
  }),
};

export const experimentRepositoryFvepProvider: Provider = {
  provide: ExperimentFvepRepository,
  // @ts-ignore
  useValue: new ExperimentFvepRepository({
    // @ts-ignore
    getRepository: fvepRepositoryToEntityMapper,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    transaction: ({ getRepository: fvepRepositoryToEntityMapper }) => {
      // this function must be empty
    },
  }),
};

export const experimentRepositoryTvepProvider: Provider = {
  provide: ExperimentTvepRepository,
  // @ts-ignore
  useValue: new ExperimentTvepRepository({
    // @ts-ignore
    getRepository: tvepRepositoryToEntityMapper,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    transaction: ({ getRepository: tvepRepositoryToEntityMapper }) => {
      // this function must be empty
    },
  }),
};

export const experimentRepositoryReaProvider: Provider = {
  provide: ExperimentReaRepository,
  useValue: new ExperimentReaRepository({
    // @ts-ignore
    getRepository: reaRepositoryToEntityMapper,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    transaction: ({ getRepository: reaRepositoryToEntityMapper }) => {
      // this function must be empty
    },
  }),
};
