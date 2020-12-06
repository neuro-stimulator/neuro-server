import { MockType } from 'test-helpers/test-helpers';

import { IpcFacade } from './ipc.facade';

export const createIpcFacadeMock: () => MockType<IpcFacade> = jest.fn(() => ({
  status: jest.fn(),
  spawn: jest.fn(),
  kill: jest.fn(),
  open: jest.fn(),
  close: jest.fn(),
}));
