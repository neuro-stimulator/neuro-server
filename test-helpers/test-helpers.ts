import { Repository } from 'typeorm';
import { Logger, LoggerService, Provider } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';

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

export const createCommandIdServiceMock: () => MockType<CommandIdService> = jest.fn(() => ({
  firstValue: jest.fn(),
  maxValue: jest.fn(),
  counter: jest.fn(),
}));

export function overrideFsModule() {
  jest.mock('fs', () => ({
    statSync: jest.fn(),
    existsSync: jest.fn(),
    readdirSync: jest.fn(),
    rmdirSync: jest.fn(),
    unlinkSync: jest.fn(),
    createReadStream: jest.fn(),
    createWriteStream: jest.fn(),
    readFileSync: jest.fn(),
    promises: {
      mkdir: jest.fn(),
      rename: jest.fn(),
    },
  }));
}

export class NoOpLogger implements LoggerService {
  log(message: any, context?: string): any {}
  error(message: any, trace?: string, context?: string): any {}
  warn(message: any, context?: string): any {}
  debug(message: any, context?: string): any {}
  verbose(message: any, context?: string): any {}
}
Logger.overrideLogger(new NoOpLogger());
Logger.prototype.debug = () => {};
Logger.prototype.error = () => {};
Logger.prototype.log = () => {};
Logger.prototype.warn = () => {};
Logger.prototype.verbose = () => {};
Logger.debug = () => {};
Logger.error = () => {};
Logger.log = () => {};
Logger.warn = () => {};
