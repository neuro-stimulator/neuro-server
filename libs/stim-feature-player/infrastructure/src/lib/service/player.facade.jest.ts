import { MockType } from 'test-helpers/test-helpers';
import { PlayerFacade } from './player.facade';

export const createPlayerFacadeMock: () => MockType<PlayerFacade> = jest.fn(() => ({
  prepare: jest.fn(),
  getPlayerState: jest.fn(),
  getStopConditions: jest.fn(),
}));
