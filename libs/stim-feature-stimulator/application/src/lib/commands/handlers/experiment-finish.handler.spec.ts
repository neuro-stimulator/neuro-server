import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, Subject } from 'rxjs';

import { CommandFromStimulator } from '@stechy1/diplomka-share';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorBlockingCommandFailedEvent } from '../../events/impl/stimulator-blocking-command-failed.event';
import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { SerialService } from '../../service/serial.service';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { ExperimentFinishedEvent } from '../../events/impl/experiment-finished.event';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentFinishCommand } from '../impl/experiment-finish.command';
import { ExperimentFinishHandler } from './experiment-finish.handler';

describe('ExperimentFinishHandler', () => {
  const defaultStimulatorRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: ExperimentFinishHandler;
  let service: MockType<StimulatorService>;
  let commandIdService: MockType<CommandIdService>;
  let eventBus: MockType<EventBus>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        ExperimentFinishHandler,
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

    handler = testingModule.get<ExperimentFinishHandler>(ExperimentFinishHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    commandIdService = testingModule.get<MockType<CommandIdService>>(CommandIdService);
    // @ts-ignore
    eventBus = testingModule.get<MockType<EventBus>>(EventBus);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    queryBus.execute.mockReturnValueOnce({ stimulatorResponseTimeout: defaultStimulatorRequestTimeout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const experimentID = 1;
    const waitForResponse = false;
    const command = new ExperimentFinishCommand(experimentID, waitForResponse);

    await handler.execute(command);

    expect(service.finishExperiment).toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });

  it('positive - should call service with waiting for a response', async () => {
    const experimentID = 1;
    const waitForResponse = true;
    const forceFinish = false;
    const commandID = 1;
    const stimulatorStateData: StimulatorStateData = {
      state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_FINISHED,
      timestamp: Date.now(),
      noUpdate: true,
      name: 'StimulatorStateData',
    };
    const event: StimulatorEvent = new StimulatorEvent(commandID, stimulatorStateData);
    let lastKnownStimulatorState;
    const command = new ExperimentFinishCommand(experimentID, waitForResponse, forceFinish);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.finishExperiment.mockImplementationOnce(() => {
      subject.next(event);
      return Promise.resolve();
    });

    await handler.execute(command);

    expect(service.finishExperiment).toBeCalled();
    expect(lastKnownStimulatorState).toBe(stimulatorStateData.state);
    expect(eventBus.publish).toBeCalledWith(new ExperimentFinishedEvent(forceFinish));
  });

  it('negative - should reject when callServiceMethod throw an error', async () => {
    const experimentID = 1;
    const waitForResponse = true;
    const commandID = 1;
    let lastKnownStimulatorState;
    const command = new ExperimentFinishCommand(experimentID, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

    Object.defineProperty(commandIdService, 'counter', {
      get: jest.fn(() => commandID),
    });
    Object.defineProperty(service, 'lastKnownStimulatorState', {
      set: jest.fn((value) => (lastKnownStimulatorState = value)),
    });
    eventBus.pipe.mockReturnValueOnce(subject);
    service.finishExperiment.mockImplementationOnce(() => {
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
    const waitForResponse = true;
    const commandID = 1;
    let lastKnownStimulatorState;
    const command = new ExperimentFinishCommand(experimentID, waitForResponse);
    const subject: Subject<any> = new Subject<any>();

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
    service.finishExperiment.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, defaultStimulatorRequestTimeout * 2);
      });
    });

    try {
      await handler.execute(command);
    } catch (e) {
      expect(service.finishExperiment).toBeCalled();
      expect(lastKnownStimulatorState).toBeUndefined();
      expect(eventBus.publish).toBeCalledWith(new StimulatorBlockingCommandFailedEvent('finish'));
    }
  });
});
