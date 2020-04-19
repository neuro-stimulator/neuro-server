import { Repository } from 'typeorm';

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
