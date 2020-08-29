import { Repository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

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

export const commandBusProvider: Provider<CommandBus> = {
  provide: CommandBus,
  // @ts-ignore
  useValue: {
    execute: jest.fn(),
  },
};

export const queryBusProvider: Provider<QueryBus> = {
  provide: QueryBus,
  // @ts-ignore
  useValue: {
    execute: jest.fn(),
  },
};

export const eventBusProvider: Provider<EventBus> = {
  provide: EventBus,
  // @ts-ignore
  useValue: {
    publish: jest.fn(),
    pipe: jest.fn(),
  },
};
