import { Observable, Subject } from 'rxjs';

import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { CommandFromStimulator, createEmptyExperiment, Experiment, Output } from '@stechy1/diplomka-share';

import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';
import { CommandIdService } from '@neuro-server/stim-lib-common';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorBlockingCommandFailedEvent } from '../../events/impl/stimulator-blocking-command-failed.event';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { ExperimentUploadCommand } from '../impl/experiment-upload.command';

import { ExperimentUploadHandler } from './experiment-upload.handler';

describe('ExperimentUploadHandler', () => {
  const defaultStimulatorRequestTimeout = 1000;
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
    testingModule.useLogger(new NoOpLogger());

    handler = testingModule.get<ExperimentUploadHandler>(ExperimentUploadHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    queryBus.execute.mockReturnValueOnce({ stimulatorResponseTimeout: defaultStimulatorRequestTimeout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response; experiment without sequences', async () => {
    const experimentID = 1;
    const userGroups = [1];
    const waitForResponse = false;
    const commandID = 0;
    const experiment: Experiment<Output> = createEmptyExperiment();
    const command = new ExperimentUploadCommand(userGroups, experimentID, undefined, waitForResponse);

    queryBus.execute.mockReturnValueOnce(experiment);

    await handler.execute(command);

    expect(service.uploadExperiment).toBeCalledWith<[Experiment<Output>, number, undefined]>(experiment, commandID, undefined);
  });

  it('positive - should call service without waiting for a response; experiment with existing sequence', async () => {
    const experimentID = 1;
    const userGroups = [1];
    const waitForResponse = false;
    const commandID = 0;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.supportSequences = true;
    const sequenceSize = 10;
    const command = new ExperimentUploadCommand(userGroups, experimentID, sequenceSize, waitForResponse);

    queryBus.execute.mockReturnValueOnce(experiment);

    await handler.execute(command);

    expect(service.uploadExperiment).toBeCalledWith(experiment, commandID, sequenceSize);
  });

  it('positive - should call service with waiting for a response; experiment without sequences', async () => {
    const experimentID = 1;
    const userGroups = [1];
    const waitForResponse = true;
    const commandID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.supportSequences = false;
    const stimulatorStateData: StimulatorStateData = {
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_UPLOADED,
      timestamp: Date.now(),
      noUpdate: true,
      name: 'StimulatorStateData',
    };
    const event: StimulatorEvent = new StimulatorEvent(commandID, stimulatorStateData);
    const command = new ExperimentUploadCommand(userGroups, experimentID, undefined, waitForResponse);
    const subject: Subject<any> = new Subject<any>();
    let lastKnownStimulatorState;

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

    expect(service.uploadExperiment).toBeCalledWith(experiment, commandID, undefined);
    expect(lastKnownStimulatorState).toBe(stimulatorStateData.state);
  });

  it('negative - should reject when callServiceMethod throw an error', async () => {
    const experimentID = 1;
    const userGroups = [1];
    const waitForResponse = true;
    const commandID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.supportSequences = true;
    const sequenceSize = 10;
    const command = new ExperimentUploadCommand(userGroups, experimentID, sequenceSize, waitForResponse);
    const subject: Subject<any> = new Subject<any>();
    let lastKnownStimulatorState;

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    queryBus.execute.mockReturnValueOnce(experiment);
    service.uploadExperiment.mockImplementationOnce(() => {
      throw new Error();
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(lastKnownStimulatorState).toBeUndefined();
      expect(eventBus.publish).not.toBeCalled();
    }
  });

  it('negative - should reject when timeout', async () => {
    const experimentID = 1;
    const userGroups = [1];
    const waitForResponse = true;
    const commandID = 1;
    const experiment: Experiment<Output> = createEmptyExperiment();
    experiment.supportSequences = true;
    const sequenceSize = 10;
    const command = new ExperimentUploadCommand(userGroups, experimentID, sequenceSize, waitForResponse);
    const subject: Subject<unknown> = new Subject<unknown>();
    let lastKnownStimulatorState;

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockImplementationOnce((...filters) => {
      let sub: Observable<any> = subject;
      for (const filter1 of filters) {
        sub = sub.pipe(filter1);
      }
      return sub;
    });
    queryBus.execute.mockReturnValueOnce(experiment);
    service.uploadExperiment.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, defaultStimulatorRequestTimeout * 2);
      });
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(service.uploadExperiment).toBeCalled();
      expect(lastKnownStimulatorState).toBeUndefined();
      expect(eventBus.publish).toBeCalledWith(new StimulatorBlockingCommandFailedEvent('upload'));
    }
  });
});
