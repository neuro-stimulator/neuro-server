import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Subject } from 'rxjs';

import { CommandFromStimulator, createEmptyExperiment, createEmptySequence, Experiment, Sequence } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { ExperimentInitializedEvent, ExperimentUploadCommand, StimulatorEvent } from '@diplomka-backend/stim-feature-stimulator/application';

import { eventBusProvider, MockType, queryBusProvider } from 'test-helpers/test-helpers';

import { CommandIdService } from '../../service/command-id.service';
import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { createCommandIdServiceMock } from '../../service/command-id.service.jest';
import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { ExperimentUploadHandler } from './experiment-upload.handler';

describe('ExperimentUploadHandler', () => {
  let testingModule: TestingModule;
  let handler: ExperimentUploadHandler;
  let service: MockType<StimulatorService>;
  let commandIdService: MockType<CommandIdService>;
  let queryBus: MockType<QueryBus>;
  let eventBus: MockType<EventBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentUploadHandler,
        {
          provide: StimulatorService,
          useFactory: createStimulatorServiceMock,
        },
        {
          provide: SerialService,
          useFactory: createSerialServiceMock,
        },
        {
          provide: CommandIdService,
          useFactory: createCommandIdServiceMock,
        },
        queryBusProvider,
        eventBusProvider,
      ],
    }).compile();

    handler = testingModule.get<ExperimentUploadHandler>(ExperimentUploadHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response; experiment without sequences', async () => {
    const experimentID = 1;
    const userID = 0;
    const waitForResponse = false;
    const commandID = 0;
    const experiment: Experiment = createEmptyExperiment();
    experiment.supportSequences = false;
    const command = new ExperimentUploadCommand(experimentID, userID, waitForResponse);

    queryBus.execute.mockReturnValueOnce(experiment);

    await handler.execute(command);

    expect(service.uploadExperiment).toBeCalledWith(commandID, experiment, undefined);
  });

  it('positive - should call service without waiting for a response; experiment with existing sequence', async () => {
    const experimentID = 1;
    const userID = 0;
    const waitForResponse = false;
    const commandID = 0;
    const experiment: Experiment = createEmptyExperiment();
    experiment.supportSequences = true;
    const sequence: Sequence = createEmptySequence();
    const command = new ExperimentUploadCommand(experimentID, userID, waitForResponse);

    queryBus.execute.mockReturnValueOnce(experiment);
    queryBus.execute.mockReturnValueOnce(sequence);

    await handler.execute(command);

    expect(service.uploadExperiment).toBeCalledWith(commandID, experiment, sequence);
  });

  it('positive - should call service with waiting for a response; experiment without sequences', async () => {
    const experimentID = 1;
    const userID = 0;
    const waitForResponse = true;
    const commandID = 1;
    const experiment: Experiment = createEmptyExperiment();
    experiment.supportSequences = false;
    const stimulatorStateData: StimulatorStateData = {
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_UPLOADED,
      timestamp: Date.now(),
      noUpdate: true,
      name: 'StimulatorStateData',
    };
    const event: StimulatorEvent = new StimulatorEvent(commandID, stimulatorStateData);
    let lastKnownStimulatorState;
    const command = new ExperimentUploadCommand(experimentID, userID, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    queryBus.execute.mockReturnValueOnce(experiment);
    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.uploadExperiment.mockImplementationOnce(() => {
      subject.next(event);
      return Promise.resolve();
    });

    await handler.execute(command);

    expect(service.uploadExperiment).toBeCalledWith(commandID, experiment, undefined);
    expect(lastKnownStimulatorState).toBe(stimulatorStateData.state);
  });
});
