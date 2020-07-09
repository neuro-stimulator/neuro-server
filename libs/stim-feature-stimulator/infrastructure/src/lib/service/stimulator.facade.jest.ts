import { MockType } from 'test-helpers/test-helpers';

import { StimulatorFacade } from './stimulator.facade';

export const createStimulatorFacadeMock: () => MockType<StimulatorFacade> = jest.fn(() => ({
  updateFirmware: jest.fn(),
  getCurrentExperimentID: jest.fn(),
  doAction: jest.fn(),
  getState: jest.fn(),
}));
