import { MockType } from 'test-helpers/test-helpers';

import { IpcFacade } from './ipc.facade';

export const createIpcFacadeMock: () => MockType<IpcFacade> = jest.fn(() => ({
  open: jest.fn(),
  close: jest.fn(),
  setOutputSynchronization: jest.fn(),
  isConnected: jest.fn(),
}));
