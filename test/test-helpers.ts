import { Repository } from 'typeorm';
import { CustomRepository } from '../src/share/custom.repository';
import { ExperimentRepository } from '../src/experiments/repository/experiment.repository';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
// export const generalRepositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
//   find: jest.fn(),
//   findOne: jest.fn(),
//   insert: jest.fn(),
//   update: jest.fn(),
//   delete: jest.fn(),
// }));

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
}));

export const generalCustomExperimentRepositoryMockFactory: () => MockType<CustomRepository<any, any>> = jest.fn(() => ({
  one: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  outputMultimedia: jest.fn(),
}));
