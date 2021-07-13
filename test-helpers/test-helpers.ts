import { Stats } from 'fs';
import { Repository } from 'typeorm';
import { Logger, LoggerService, Provider } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

import {
  Experiment,
  ExperimentType,
  Output,
  createEmptyExperiment,
  createEmptyExperimentERP,
  createEmptyExperimentCVEP,
  createEmptyExperimentTVEP,
  createEmptyExperimentFVEP,
  createEmptyExperimentREA,
  createEmptyOutputERP,
  ExperimentERP
} from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';

export type MockType<T> = {
  [P in keyof Partial<T>]: jest.Mock<{}>;
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

export const fsMockFactory = () => ({
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
});

export function fakeFileStats(partialStats: Partial<Stats> = {}): MockType<Stats> {
  return {
    isFile: jest.fn(),
    isDirectory: jest.fn(),
    isBlockDevice: jest.fn(),
    isCharacterDevice: jest.fn(),
    isSymbolicLink: jest.fn(),
    isFIFO: jest.fn(),
    isSocket: jest.fn(),

    dev: jest.fn().mockReturnValue(partialStats.dev ? partialStats.dev : 0),
    ino: jest.fn().mockReturnValue(partialStats.ino ? partialStats.ino : 0),
    mode: jest.fn().mockReturnValue(partialStats.mode ? partialStats.mode : 0),
    nlink: jest.fn().mockReturnValue(partialStats.nlink ? partialStats.nlink : 0),
    uid: jest.fn().mockReturnValue(partialStats.uid ? partialStats.uid : 0),
    gid: jest.fn().mockReturnValue(partialStats.gid ? partialStats.gid : 0),
    rdev: jest.fn().mockReturnValue(partialStats.rdev ? partialStats.rdev : 0),
    size: jest.fn().mockReturnValue(partialStats.size ? partialStats.size : 0),
    blksize: jest.fn().mockReturnValue(partialStats.blksize ? partialStats.blksize : 0),
    blocks: jest.fn().mockReturnValue(partialStats.blocks ? partialStats.blocks : 0),
    atimeMs: jest.fn().mockReturnValue(partialStats.atimeMs ? partialStats.atimeMs : 0),
    mtimeMs: jest.fn().mockReturnValue(partialStats.mtimeMs ? partialStats.mtimeMs : 0),
    ctimeMs: jest.fn().mockReturnValue(partialStats.ctimeMs ? partialStats.ctimeMs : 0),
    birthtimeMs: jest.fn().mockReturnValue(partialStats.birthtimeMs ? partialStats.birthtimeMs : 0),
    atime: jest.fn().mockReturnValue(partialStats.atime ? partialStats.atime : 0),
    mtime: jest.fn().mockReturnValue(partialStats.mtime ? partialStats.mtime : 0),
    ctime: jest.fn().mockReturnValue(partialStats.ctime ? partialStats.ctime : 0),
    birthtime: jest.fn().mockReturnValue(partialStats.birthtime ? partialStats.birthtime : 0),
  };
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
