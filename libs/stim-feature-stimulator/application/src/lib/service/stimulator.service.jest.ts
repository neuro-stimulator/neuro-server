import { MockType } from 'test-helpers/test-helpers';

import { StimulatorService } from './stimulator.service';

export const createStimulatorServiceMock: () => MockType<StimulatorService> = jest.fn(() => ({
  currentExperimentID: jest.fn(),
  updateFirmware: jest.fn(),
  stimulatorState: jest.fn(),
  uploadExperiment: jest.fn(),
  setupExperiment: jest.fn(),
  runExperiment: jest.fn(),
  pauseExperiment: jest.fn(),
  finishExperiment: jest.fn(),
  clearExperiment: jest.fn(),
  sendNextSequencePart: jest.fn(),
  togleLed: jest.fn(),
}));
