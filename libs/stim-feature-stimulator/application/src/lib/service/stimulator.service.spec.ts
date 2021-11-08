import { Test, TestingModule } from '@nestjs/testing';

import { StimulatorProtocol } from '@neuro-server/stim-feature-stimulator/domain';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StimulatorService } from './stimulator.service';
import { SerialService } from './serial.service';
import { createSerialServiceMock } from './serial.service.jest';
import { createStimulatorProtocolMock } from './stimulator.protocol.jest';
import { createEmptyExperiment, createEmptySequence, Experiment, Output, Sequence } from '@stechy1/diplomka-share/lib';

describe('StimulatorService', () => {

  let testingModule: TestingModule;
  let service: StimulatorService;
  let serialService: MockType<SerialService>;
  let stimulatorProtocol: MockType<StimulatorProtocol>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StimulatorService,

        {
          provide: SerialService,
          useFactory: createSerialServiceMock
        },
        {
          provide: StimulatorProtocol,
          useFactory: createStimulatorProtocolMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    service = testingModule.get<StimulatorService>(StimulatorService);

    //@ts-ignore
    serialService = testingModule.get<MockType<SerialService>>(SerialService);
    //@ts-ignore
    stimulatorProtocol = testingModule.get<MockType<StimulatorProtocol>>(StimulatorProtocol);
  });

  it('positive - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('stimulatorState()', () => {
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandSTIMULATOR_STATE.mockReturnValueOnce(buffer);

    service.stimulatorState();

    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('uploadExperiment()', () => {
    const experiment: Experiment<Output> = createEmptyExperiment();
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandEXPERIMENT_UPLOAD.mockReturnValueOnce(buffer);

    service.uploadExperiment(experiment);

    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('setupExperiment()', () => {
    const experimentID = 1;
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT.mockReturnValueOnce(buffer);

    service.setupExperiment(undefined, experimentID);

    expect(stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT).toBeCalledWith('setup', expect.any(Number));
    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('runExperiment()', () => {
    const experimentID = 1;
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT.mockReturnValueOnce(buffer);

    service.runExperiment(undefined, experimentID);

    expect(stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT).toBeCalledWith('run', expect.any(Number));
    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('pauseExperiment()', () => {
    const experimentID = 1;
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT.mockReturnValueOnce(buffer);

    service.pauseExperiment(undefined, experimentID);

    expect(stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT).toBeCalledWith('pause', expect.any(Number));
    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('finishExperiment()', () => {
    const experimentID = 1;
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT.mockReturnValueOnce(buffer);

    service.finishExperiment(undefined, experimentID);

    expect(stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT).toBeCalledWith('finish', expect.any(Number));
    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('clearExperiment()', () => {
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT.mockReturnValueOnce(buffer);

    service.clearExperiment();

    expect(stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT).toBeCalledWith('clear', expect.any(Number));
    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('sendNextSequencePart()', () => {
    const sequence: Sequence = createEmptySequence();
    const offset = 0;
    const index = 0;
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandNEXT_SEQUENCE_PART.mockReturnValueOnce(buffer);

    service.sendNextSequencePart(sequence, offset, index);

    expect(serialService.write).toBeCalledWith(buffer);
  });

  it('toggleLed()', () => {
    const ledIndex = 0;
    const brightness = 100;
    const buffer: Buffer = Buffer.from([0, 1, 2]);

    stimulatorProtocol.bufferCommandBACKDOOR_1.mockReturnValueOnce(buffer);

    service.toggleLed(brightness, ledIndex);

    expect(serialService.write).toBeCalledWith(buffer);
  });

});
