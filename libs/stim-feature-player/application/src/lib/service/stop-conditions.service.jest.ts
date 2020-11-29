import { MockType } from 'test-helpers/test-helpers';

import { StopConditionsService } from './stop-conditions.service';

export const createStopConditionsServiceMock: () => MockType<StopConditionsService> = jest.fn(() => ({
  insert: jest.fn(),
  stopConditionsForExperimentType: jest.fn(),
}));
