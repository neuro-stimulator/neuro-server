import { MockType } from "../test-helpers";
import { CommandsService } from "./commands.service";

export const createCommandsServiceMock: () => MockType<CommandsService> = jest.fn(() => ({
  stimulatorState: jest.fn(),
  uploadExperiment: jest.fn(),
  setupExperiment: jest.fn(),
  runExperiment: jest.fn(),
  pauseExperiment: jest.fn(),
  finishExperiment: jest.fn(),
  clearExperiment: jest.fn(),
  sendNextSequencePart: jest.fn(),
  togleLed: jest.fn(),
  memoryRequest: jest.fn(),
  registerMessagePublisher: jest.fn(),
  publishMessage: jest.fn()
}));
