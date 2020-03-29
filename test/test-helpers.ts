import { Repository } from 'typeorm';
import { CustomExperimentRepository } from '../src/share/custom-experiment-repository';
import { ExperimentRepository } from '../src/experiments/repository/experiment.repository';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
export const generalRepositoryMockFactory: MockType<Repository<any>> = {
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const generalExperimentRepositoryMockFactory: () => MockType<ExperimentRepository> = jest.fn(() => ({
  all: jest.fn(),
  one: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  nameExists: jest.fn()
}));

export const generalCustomExperimentRepositoryMockFactory: () => MockType<CustomExperimentRepository<any, any>> = jest.fn(() => ({
  one: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  outputMultimedia: jest.fn(),
  validate: jest.fn()
}));

export const mockEntityManagerFactory: () => MockType<{getRepository: () => any}> = jest.fn(() => {
  return ({
    getRepository: jest.fn((args) => {
      return generalRepositoryMockFactory;
    }),
  });
});
