import { MockType } from 'test-helpers/test-helpers';
import { PlayerService } from './player.service';

export const createPlayerServiceMock: () => MockType<Partial<PlayerService>> = jest.fn(() => ({
  createEmptyExperimentResult: jest.fn(),
  clearRunningExperimentResult: jest.fn(),
  pushResultData: jest.fn(),
  nextExperimentRound: jest.fn(),
  scheduleNextRound: jest.fn(),
}));
