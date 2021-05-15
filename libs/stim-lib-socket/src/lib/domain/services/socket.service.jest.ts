import { MockType } from 'test-helpers/test-helpers';

import { SocketService } from './socket.service';

export const createSocketServiceMock: () => MockType<SocketService> = jest.fn(() => ({
  handleConnection: jest.fn(),
  handleDisconnect: jest.fn(),
  sendCommand: jest.fn(),
  broadcastCommand: jest.fn()
}));
