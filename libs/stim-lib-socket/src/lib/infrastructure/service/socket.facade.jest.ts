import { MockType } from 'test-helpers/test-helpers';

import { SocketFacade } from './socket.facade';

export const createSeedFacadeMock: () => MockType<SocketFacade> = jest.fn(() => ({
  sendCommand: jest.fn(),
  broadcastCommand: jest.fn(),
}));
