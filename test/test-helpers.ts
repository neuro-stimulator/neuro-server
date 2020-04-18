import { Repository } from 'typeorm';
import { CustomExperimentRepository } from '../src/share/custom-experiment-repository';
import { ExperimentRepository } from '../src/experiments/repository/experiment.repository';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

// @ts-ignore
export const createRepositoryMock: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(),
  findOne: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

export const mockEntityManagerFactory: () => MockType<{getRepository: () => any}> = jest.fn(() => {
  return ({
    getRepository: jest.fn((args) => {
      return createRepositoryMock;
    }),
  });
});
