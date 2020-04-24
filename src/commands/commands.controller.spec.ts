import { Test, TestingModule } from '@nestjs/testing';

import { createEmptyExperiment, Experiment, MessageCodes, ResponseObject } from '@stechy1/diplomka-share';

import { MockType } from '../test-helpers';
import { EventStimulatorState } from '../low-level/protocol/hw-events';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { createCommandsServiceMock } from './commands.service.jest';

describe('Commands controller', () => {
  let testingModule: TestingModule;
  let controller: CommandsController;
  let mockCommandsService: MockType<CommandsService>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [CommandsController],
      providers: [
        {
          provide: CommandsService,
          useFactory: createCommandsServiceMock
        }
      ]
    }).compile();

    controller = testingModule.get<CommandsController>(CommandsController);
    // @ts-ignore
    mockCommandsService = testingModule.get<MockType<CommandsService>>(CommandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('stimulatorState()', () => {
    it('positive - should send request and wait for stimulator state', async () => {
      const state = 4;
      const noUpdate = 1;
      const now = Date.now() / 1000;
      const sourceBuffer: Buffer = Buffer.alloc(6);
      sourceBuffer.writeUInt8(state, 0);
      sourceBuffer.writeUInt8(noUpdate, 1);
      sourceBuffer.writeUInt32LE(now, 2);
      const event: EventStimulatorState = new EventStimulatorState(sourceBuffer, 0);

      mockCommandsService.stimulatorState.mockReturnValue(event);

      const result: ResponseObject<EventStimulatorState|undefined> = await controller.stimulatorState();
      const expected: ResponseObject<EventStimulatorState|undefined> = { data: event };

      expect(result).toEqual(expected);
    });

    it('negative - should throw exception when stimulator will not respond', async () => {
      mockCommandsService.stimulatorState.mockImplementationOnce(() => {
        throw new Error(`${MessageCodes.CODE_ERROR}`);
      });

      const expected: ResponseObject<void> = { message: { code: MessageCodes.CODE_ERROR } };
      const result = await controller.stimulatorState();

      expect(result).toEqual(expected);
    });
  });

  describe('uploadExperiment()', () => {
    it('positive - should upload an experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await controller.uploadExperiment({ id: experiment.id });

      expect(mockCommandsService.uploadExperiment).toBeCalledWith(experiment.id);
    });
  });

  describe('setupExperiment()', () => {
    it('positive - should setup an experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await controller.setupExperiment({ id: experiment.id });

      expect(mockCommandsService.setupExperiment).toBeCalledWith(experiment.id);
    });
  });

  describe('runExperiment()', () => {
    it('positive - should run an experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await controller.runExperiment({ id: experiment.id });

      expect(mockCommandsService.runExperiment).toBeCalledWith(experiment.id);
    });
  });

  describe('pauseExperiment()', () => {
    it('positive - should pause an experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await controller.pauseExperiment({ id: experiment.id });

      expect(mockCommandsService.pauseExperiment).toBeCalledWith(experiment.id);
    });
  });

  describe('finishExperiment()', () => {
    it('positive - should finish an experiment', async () => {
      const experiment: Experiment = createEmptyExperiment();

      await controller.finishExperiment({ id: experiment.id });

      expect(mockCommandsService.finishExperiment).toBeCalledWith(experiment.id);
    });
  });

  describe('clearExperiment()', () => {
    it('positive - should clear an experiment', async () => {
      await controller.clearExperiment();

      expect(mockCommandsService.clearExperiment).toBeCalled();
    });
  });

});
