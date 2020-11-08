import { MockType } from 'test-helpers/test-helpers';
import { IpcService } from './ipc.service';

export const createIpcServiceMock: () => MockType<IpcService> = jest.fn(() => ({
  open: jest.fn(),
  close: jest.fn(),
  send: jest.fn(),
  isConnected: jest.fn(),
}));
