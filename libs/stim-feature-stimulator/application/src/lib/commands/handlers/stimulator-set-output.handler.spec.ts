import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';

import { createCommandIdServiceMock, eventBusProvider, MockType, NoOpLogger, queryBusProvider } from 'test-helpers/test-helpers';

import { StimulatorService } from '../../service/stimulator.service';
import { createStimulatorServiceMock } from '../../service/stimulator.service.jest';
import { createSerialServiceMock } from '../../service/serial.service.jest';
import { SerialService } from '../../service/serial.service';
import { StimulatorSetOutputCommand } from '../impl/stimulator-set-output.command';
import { StimulatorSetOutputHandler } from './stimulator-set-output.handler';

describe('StimulatorSetOutputHandler', () => {
  const defaultStimulatorRequestTimeout = 1000;
  let testingModule: TestingModule;
  let handler: StimulatorSetOutputHandler;
  let service: MockType<StimulatorService>;
  let queryBus: MockType<QueryBus>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StimulatorSetOutputHandler,
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

    handler = testingModule.get<StimulatorSetOutputHandler>(StimulatorSetOutputHandler);
    // @ts-ignore
    service = testingModule.get<MockType<StimulatorService>>(StimulatorService);
    // @ts-ignore
    queryBus = testingModule.get<MockType<QueryBus>>(QueryBus);
    queryBus.execute.mockReturnValue({ stimulatorResponseTimeout: defaultStimulatorRequestTimeout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should call service without waiting for a response', async () => {
    const experimentID = 1;
    const waitForResponse = false;
    const command = new StimulatorSetOutputCommand(experimentID, waitForResponse);

    await handler.execute(command);

    expect(service.toggleLed).toBeCalled();
  });

  // it('positive - should call service with waiting for a response', async () => {
  //   const experimentID = 1;
  //   const waitForResponse = true;
  //   const commandID = 1;
  //   const stimulatorStateData: StimulatorStateData = {
  //     state: CommandFromStimulator.COMMAND_STIMULATOR_STATE_INITIALIZED,
  //     timestamp: Date.now(),
  //     noUpdate: true,
  //     name: 'StimulatorStateData',
  //   };
  //   const event: StimulatorEvent = new StimulatorEvent(commandID, stimulatorStateData);
  //   let lastKnownStimulatorState;
  //   const command = new StimulatorSetOutputCommand(experimentID, waitForResponse);
  //   const subject: Subject<any> = new Subject<any>();
  //
  //   Object.defineProperty(commandIdService, 'counter', {
  //     get: jest.fn(() => commandID),
  //   });
  //   Object.defineProperty(service, 'lastKnownStimulatorState', {
  //     set: jest.fn((value) => (lastKnownStimulatorState = value)),
  //   });
  //   eventBus.pipe.mockReturnValueOnce(subject);
  //   service.setupExperiment.mockImplementationOnce(() => {
  //     subject.next(event);
  //     return Promise.resolve();
  //   });
  //
  //   await handler.execute(command);
  //
  //   expect(service.setupExperiment).toBeCalled();
  //   expect(lastKnownStimulatorState).toBe(stimulatorStateData.state);
  //   expect(eventBus.publish).toBeCalledWith(new ExperimentInitializedEvent(stimulatorStateData.timestamp));
  // });
  //
  //    it('negative - should reject when callServiceMethod throw an error', async (done: DoneCallback) => {
  //     const experimentID = 1;
  //     const waitForResponse = true;
  //     const commandID = 1;
  //     let lastKnownStimulatorState;
  //     const command = new ExperimentFinishCommand(experimentID, waitForResponse);
  //     const subject: Subject<any> = new Subject<any>();
  //
  //     Object.defineProperty(commandIdService, 'counter', {
  //       get: jest.fn(() => commandID),
  //     });
  //     Object.defineProperty(service, 'lastKnownStimulatorState', {
  //       set: jest.fn((value) => (lastKnownStimulatorState = value)),
  //     });
  //     eventBus.pipe.mockReturnValueOnce(subject);
  //     service.finishExperiment.mockImplementationOnce(() => {
  //       throw new Error();
  //     });
  //
  //     try {
  //       await handler.execute(command);
  //       done.fail();
  //     } catch (e) {
  //       expect(service.finishExperiment).toBeCalled();
  //       expect(lastKnownStimulatorState).toBeUndefined();
  //       expect(eventBus.publish).not.toBeCalled();
  //       done();
  //     }
  //   });
  //
  //   it('negative - should reject when timeout', async (done: DoneCallback) => {
  //     const experimentID = 1;
  //     const waitForResponse = true;
  //     const commandID = 1;
  //     let lastKnownStimulatorState;
  //     const command = new ExperimentFinishCommand(experimentID, waitForResponse);
  //     const subject: Subject<any> = new Subject<any>();
  //
  //     Object.defineProperty(commandIdService, 'counter', {
  //       get: jest.fn(() => commandID),
  //     });
  //     Object.defineProperty(service, 'lastKnownStimulatorState', {
  //       set: jest.fn((value) => (lastKnownStimulatorState = value)),
  //     });
  //     eventBus.pipe.mockImplementationOnce((...filters) => {
  //       let sub: Observable<any> = subject;
  //       for (const filter1 of filters) {
  //         sub = sub.pipe(filter1);
  //       }
  //       return sub;
  //     });
  //     service.finishExperiment.mockImplementationOnce(() => {
  //       return interval(defaultStimulatorRequestTimeout * 2).toPromise();
  //     });
  //
  //     try {
  //       await handler.execute(command);
  //       done.fail();
  //     } catch (e) {
  //       expect(service.finishExperiment).toBeCalled();
  //       expect(lastKnownStimulatorState).toBeUndefined();
  //       expect(eventBus.publish).not.toBeCalled();
  //       done();
  //     }
  //   });
});
