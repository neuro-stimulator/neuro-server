// import { Test, TestingModule } from '@nestjs/testing';
// import { CommandsService } from './commands.service';
// import { SerialService } from '../low-level/serial.service';
// import { ExperimentsService } from 'libs/stim-feature-experiments/src/lib/domain/services/experiments.service';
// import { ExperimentResultsService } from 'libs/stim-feature-experiment-results/src/lib/domain/services/experiment-results.service';
// import { SequencesService } from '../sequences/sequences.service';
// import { IpcService } from '../ipc/ipc.service';
// import { MockType } from '../test-helpers';
// import {
//   bufferCommandEXPERIMENT_UPLOAD,
//   bufferCommandMANAGE_EXPERIMENT,
//   bufferCommandNEXT_SEQUENCE_PART,
//   bufferCommandSTIMULATOR_STATE,
// } from './protocol/functions.protocol';
// import { EventStimulatorState } from '../low-level/protocol/hw-events';
// import {
//   createEmptyExperiment,
//   createEmptyExperimentCVEP,
//   createEmptyExperimentERP,
//   createEmptyExperimentResult,
//   createEmptyOutputERP,
//   createEmptySequence,
//   Experiment,
//   ExperimentERP,
//   ExperimentResult,
//   MessageCodes,
//   Sequence,
// } from '@stechy1/diplomka-share';
// import { TOPIC_EXPERIMENT_STATUS } from '../ipc/protocol/ipc.protocol';
// import exp = require('constants');
// import { TOTAL_OUTPUT_COUNT } from '../config/config';
// import DoneCallback = jest.DoneCallback;
// import { createSerialServiceMock } from '../low-level/serial.service.jest';
// import { createExperimentsServiceMock } from 'libs/stim-feature-experiments/src/lib/domain/services/experiments.service.jest';
// import { createExperimentResultsServiceMock } from 'libs/stim-feature-experiment-results/src/lib/domain/services/experiment-results.service.jest';
// import { createSequencesServiceMock } from '../sequences/sequences.service.jest';
// import { createIpcServiceMock } from '../ipc/ipc.service.jest';
//
// describe('Commands service', () => {
//   let testingModule: TestingModule;
//   let commandsService: CommandsService;
//
//   let mockSerialService: MockType<SerialService>;
//   let mockExperimentsService: MockType<ExperimentsService>;
//   let mockExperimentResultsService: MockType<ExperimentResultsService>;
//   let mockSequencesService: MockType<SequencesService>;
//   let mockIpcService: MockType<IpcService>;
//
//   beforeEach(async () => {
//     testingModule = await Test.createTestingModule({
//       providers: [
//         CommandsService,
//         { provide: SerialService, useFactory: createSerialServiceMock },
//         {
//           provide: ExperimentsService,
//           useFactory: createExperimentsServiceMock,
//         },
//         {
//           provide: ExperimentResultsService,
//           useFactory: createExperimentResultsServiceMock,
//         },
//         { provide: SequencesService, useFactory: createSequencesServiceMock },
//         { provide: IpcService, useFactory: createIpcServiceMock },
//       ],
//     }).compile();
//
//     // TESTING SERVICE
//     commandsService = testingModule.get<CommandsService>(CommandsService);
//     // MOCKS
//     // @ts-ignore
//     mockSerialService = testingModule.get<MockType<SerialService>>(
//       SerialService
//     );
//     // @ts-ignore
//     mockExperimentsService = testingModule.get<MockType<ExperimentsService>>(
//       ExperimentsService
//     );
//     // @ts-ignore
//     mockExperimentResultsService = testingModule.get<
//       MockType<ExperimentResultsService>
//     >(ExperimentResultsService);
//     // @ts-ignore
//     mockSequencesService = testingModule.get<MockType<SequencesService>>(
//       SequencesService
//     );
//     // @ts-ignore
//     mockIpcService = testingModule.get<MockType<IpcService>>(IpcService);
//   });
//
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//
//   it('positive - should be defined', () => {
//     expect(commandsService).toBeDefined();
//   });
//
//   describe('stimulatorState()', () => {
//     it('positive - should send command for stimulator state without waiting for the result', async () => {
//       await commandsService.stimulatorState(false);
//
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandSTIMULATOR_STATE()
//       );
//     });
//
//     it('positive - should send command for stimulator state and wait for the result', async () => {
//       const state = 4;
//       const noUpdate = 1;
//       const now = Date.now() / 1000;
//       const sourceBuffer: Buffer = Buffer.alloc(6);
//       sourceBuffer.writeUInt8(state, 0);
//       sourceBuffer.writeUInt8(noUpdate, 1);
//       sourceBuffer.writeUInt32LE(now, 2);
//
//       mockSerialService.bindEvent = jest.fn(
//         (name: string, callback: (event: EventStimulatorState) => void) => {
//           return setTimeout(() => {
//             callback(new EventStimulatorState(sourceBuffer, 0));
//           }, 500);
//         }
//       );
//
//       const event: EventStimulatorState = await commandsService.stimulatorState(
//         true
//       );
//
//       expect(mockSerialService.bindEvent).toBeCalled();
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandSTIMULATOR_STATE()
//       );
//       expect(mockSerialService.unbindEvent).toBeCalled();
//       expect(event).toBeDefined();
//       expect(event.state).toBe(state);
//       expect(event.noUpdate).toBe(Boolean(noUpdate));
//       expect(event.timestamp).toBe(Math.trunc(now));
//     });
//
//     it('negative', async (done: DoneCallback) => {
//       try {
//         await commandsService.stimulatorState(true);
//         done.fail();
//       } catch (e) {
//         expect(mockSerialService.bindEvent).toBeCalled();
//         expect(mockSerialService.write).toBeCalledWith(
//           bufferCommandSTIMULATOR_STATE()
//         );
//         expect(mockSerialService.unbindEvent).toBeCalled();
//         expect(e.message).toBe(`${MessageCodes.CODE_ERROR}`);
//         done();
//       }
//     });
//   });
//
//   describe('uploadExperiment()', () => {
//     it('positive - should upload experiment with sequence to stimulator', async () => {
//       const experiment: ExperimentERP = createEmptyExperimentERP();
//       experiment.id = 1;
//       experiment.outputCount = TOTAL_OUTPUT_COUNT;
//       experiment.outputs = new Array(experiment.outputCount)
//         .fill(0)
//         .map((value, index: number) => createEmptyOutputERP(experiment, index));
//       const sequence: Sequence = createEmptySequence();
//       sequence.size = 20;
//
//       mockExperimentsService.byId = jest.fn().mockReturnValue(experiment);
//       mockSequencesService.byId = jest.fn().mockReturnValue(sequence);
//
//       await commandsService.uploadExperiment(experiment.id);
//
//       expect(mockIpcService.send).toBeCalledWith(TOPIC_EXPERIMENT_STATUS, {
//         status: 'upload',
//         id: experiment.id,
//         outputCount: experiment.outputCount,
//       });
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandEXPERIMENT_UPLOAD(experiment, sequence)
//       );
//       expect(
//         mockExperimentResultsService.createEmptyExperimentResult
//       ).toBeCalledWith(experiment);
//     });
//     // TODO negative test when experiment is not found
//   });
//
//   describe('setupExperiment()', () => {
//     it('positive - should send command for experiment initialization', async () => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//       experiment.outputCount = TOTAL_OUTPUT_COUNT;
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//
//       Object.defineProperty(
//         mockExperimentResultsService,
//         'activeExperimentResult',
//         {
//           get: jest.fn().mockReturnValue(experimentResult),
//         }
//       );
//
//       await commandsService.setupExperiment(experiment.id);
//
//       expect(mockIpcService.send).toBeCalledWith(TOPIC_EXPERIMENT_STATUS, {
//         status: 'setup',
//         id: experiment.id,
//       });
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandMANAGE_EXPERIMENT('setup')
//       );
//     });
//
//     it('negative - should not init not uploaded experiment', async (done: DoneCallback) => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//
//       try {
//         await commandsService.setupExperiment(experiment.id + 1);
//         done.fail();
//       } catch (e) {
//         expect(e.message).toBe(
//           `${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_SETUP_NOT_UPLOADED}`
//         );
//         expect(mockIpcService.send).not.toBeCalled();
//         expect(mockSerialService.write).not.toBeCalled();
//         done();
//       }
//     });
//   });
//
//   describe('runExperiment()', () => {
//     it('positive - should send command for run experiment', async () => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//       experiment.outputCount = TOTAL_OUTPUT_COUNT;
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//
//       Object.defineProperty(
//         mockExperimentResultsService,
//         'activeExperimentResult',
//         {
//           get: jest.fn().mockReturnValue(experimentResult),
//         }
//       );
//
//       await commandsService.runExperiment(experiment.id);
//
//       expect(mockIpcService.send).toBeCalledWith(TOPIC_EXPERIMENT_STATUS, {
//         status: 'run',
//         id: experiment.id,
//       });
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandMANAGE_EXPERIMENT('run')
//       );
//     });
//
//     it('negative - should not run not initialized experiment', async (done: DoneCallback) => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//
//       try {
//         await commandsService.runExperiment(experiment.id + 1);
//         done.fail();
//       } catch (e) {
//         expect(e.message).toBe(
//           `${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_RUN_NOT_INITIALIZED}`
//         );
//         expect(mockIpcService.send).not.toBeCalled();
//         expect(mockSerialService.write).not.toBeCalled();
//         done();
//       }
//     });
//   });
//
//   describe('pauseExperiment()', () => {
//     it('positive - should send command for pause experiment', async () => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//       experiment.outputCount = TOTAL_OUTPUT_COUNT;
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//
//       Object.defineProperty(
//         mockExperimentResultsService,
//         'activeExperimentResult',
//         {
//           get: jest.fn().mockReturnValue(experimentResult),
//         }
//       );
//
//       await commandsService.pauseExperiment(experiment.id);
//
//       expect(mockIpcService.send).toBeCalledWith(TOPIC_EXPERIMENT_STATUS, {
//         status: 'pause',
//         id: experiment.id,
//       });
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandMANAGE_EXPERIMENT('pause')
//       );
//     });
//
//     it('negative - should not pause not running experiment', async (done: DoneCallback) => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//
//       try {
//         await commandsService.pauseExperiment(experiment.id + 1);
//         done.fail();
//       } catch (e) {
//         expect(e.message).toBe(
//           `${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_PAUSE_NOT_STARTED}`
//         );
//         expect(mockIpcService.send).not.toBeCalled();
//         expect(mockSerialService.write).not.toBeCalled();
//         done();
//       }
//     });
//   });
//
//   describe('finishExperiment()', () => {
//     it('positive - should send command for finish experiment', async () => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//       experiment.outputCount = TOTAL_OUTPUT_COUNT;
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//
//       Object.defineProperty(
//         mockExperimentResultsService,
//         'activeExperimentResult',
//         {
//           get: jest.fn().mockReturnValue(experimentResult),
//         }
//       );
//
//       await commandsService.finishExperiment(experiment.id);
//
//       expect(mockIpcService.send).toBeCalledWith(TOPIC_EXPERIMENT_STATUS, {
//         status: 'finish',
//         id: experiment.id,
//       });
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandMANAGE_EXPERIMENT('finish')
//       );
//     });
//
//     it('negative - should not finish not running experiment', async (done: DoneCallback) => {
//       const experiment: Experiment = createEmptyExperiment();
//       experiment.id = 1;
//
//       try {
//         await commandsService.finishExperiment(experiment.id + 1);
//         done.fail();
//       } catch (e) {
//         expect(e.message).toBe(
//           `${MessageCodes.CODE_ERROR_COMMANDS_EXPERIMENT_FINISH_NOT_RUNNING}`
//         );
//         expect(mockIpcService.send).not.toBeCalled();
//         expect(mockSerialService.write).not.toBeCalled();
//         done();
//       }
//     });
//   });
//
//   describe('clearExperiment()', () => {
//     it('positive - should send command for clear experiment', async () => {
//       commandsService.clearExperiment();
//
//       expect(mockIpcService.send).toBeCalledWith(TOPIC_EXPERIMENT_STATUS, {
//         status: 'clear',
//       });
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandMANAGE_EXPERIMENT('clear')
//       );
//     });
//   });
//
//   describe('sendNextSequencePart()', () => {
//     it('positive - should send command with next sequence part', async () => {
//       const experiment: ExperimentERP = createEmptyExperimentERP();
//       experiment.id = 1;
//       experiment.outputCount = TOTAL_OUTPUT_COUNT;
//       experiment.outputs = new Array(experiment.outputCount)
//         .fill(0)
//         .map((value, i: number) => createEmptyOutputERP(experiment, i));
//       const experimentResult: ExperimentResult = createEmptyExperimentResult(
//         experiment
//       );
//       const sequence: Sequence = createEmptySequence();
//       sequence.size = 20;
//       sequence.data = new Array(sequence.size)
//         .fill(0)
//         .map(() => Math.round(Math.random() * experiment.outputCount));
//       const offset = 4;
//       const index = 1;
//
//       Object.defineProperty(
//         mockExperimentResultsService,
//         'activeExperimentResult',
//         {
//           get: jest.fn().mockReturnValue(experimentResult),
//         }
//       );
//       mockExperimentsService.byId = jest.fn().mockReturnValue(experiment);
//       mockSequencesService.byId = jest.fn().mockReturnValue(sequence);
//
//       await commandsService.sendNextSequencePart(offset, index);
//
//       expect(mockSerialService.write).toBeCalledWith(
//         bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index)
//       );
//     });
//   });
// });
