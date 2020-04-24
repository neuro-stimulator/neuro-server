import { MockType } from '../test-helpers';
import { IpcService } from './ipc.service';

export const createIpcServiceMock: () => MockType<IpcService> = jest.fn(() => ({
  send: jest.fn(),
  registerMessagePublisher: jest.fn(),
  publishMessage: jest.fn(),
  isConnected: jest.fn()
}));
