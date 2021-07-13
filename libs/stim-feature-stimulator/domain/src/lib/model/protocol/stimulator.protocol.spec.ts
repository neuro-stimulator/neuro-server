import { Test, TestingModule } from '@nestjs/testing';

import { CommandToStimulator, createEmptyExperiment, createEmptySequence, Experiment, Output, Sequence } from '@stechy1/diplomka-share';

import { MockType, NoOpLogger } from 'test-helpers/test-helpers';

import { StimulatorActionType } from '../stimulator-action-type';
import { createExperimentProtocolCodecMock } from './experiment.protocol.codec.jest';
import { createSequenceProtocolCodecMock } from './sequence.protocol.codec.jest';
import { ExperimentProtocolCodec } from './experiment.protocol.codec';
import { SequenceProtocolCodec } from './sequence.protocol.codec';
import { StimulatorProtocol } from './stimulator.protocol';

describe('Stimulator protocol', () => {

  let testingModule: TestingModule;
  let stimulatorProtocol: StimulatorProtocol;
  let experimentProtocolFactory: MockType<ExperimentProtocolCodec>;
  let sequenceProtocolFactory: MockType<SequenceProtocolCodec>;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        StimulatorProtocol,

        {
          provide: ExperimentProtocolCodec,
          useFactory: createExperimentProtocolCodecMock
        },
        {
          provide: SequenceProtocolCodec,
          useFactory: createSequenceProtocolCodecMock
        }
      ]
    }).compile();
    testingModule.useLogger(new NoOpLogger());

    stimulatorProtocol = testingModule.get<StimulatorProtocol>(StimulatorProtocol);
    // @ts-ignore
    experimentProtocolFactory = testingModule.get<MockType<ExperimentProtocolCodec>>(ExperimentProtocolCodec);
    // @ts-ignore
    sequenceProtocolFactory = testingModule.get<MockType<SequenceProtocolCodec>>(SequenceProtocolCodec);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('positive - should be defined', () => {
    expect(stimulatorProtocol).toBeDefined();
  });

  describe('Command STIMULATOR_STATE', () => {
    it('positive - should have right packet format', () => {
      const commandID = 0;
      const command = stimulatorProtocol.bufferCommandSTIMULATOR_STATE(commandID);
      let offset = 0;

      expect(command.length).toBe(3);
      expect(command.readUInt8(offset++)).toBe(commandID);
      expect(command.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_STIMULATOR_STATE);
      expect(command.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
    });
  });

  describe('Command MANAGE_EXPERIMENT', () => {
    test.each(Object.entries(StimulatorProtocol.MANAGE_EXPERIMENT_MAP))(
      'should have right command format for %s', (key, value) => {
        const commandID = 0;
        const command = stimulatorProtocol.bufferCommandMANAGE_EXPERIMENT(key as Exclude<StimulatorActionType, 'upload'>, commandID);
        let offset = 0;

        expect(command.length).toBe(4);
        expect(command.readUInt8(offset++)).toBe(commandID);
        expect(command.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT);
        expect(command.readUInt8(offset++)).toBe(value);
        expect(command.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
      });
  });

  describe('Command EXPERIMENT_UPLOAD', () => {
    it('positive - should call experiment protocol factory', () => {
      const commandID = 1;
      const experiment: Experiment<Output> = createEmptyExperiment();
      const sequenceSize = 10;

      stimulatorProtocol.bufferCommandEXPERIMENT_UPLOAD(experiment, commandID, sequenceSize);

      expect(experimentProtocolFactory.encodeExperiment).toBeCalledWith(experiment, commandID, sequenceSize);
    })
  });

  describe('Command NEXT_SEQUENCE_PART', () => {
    it('positive - should call sequence protocol factory', () => {
      const commandID = 0;
      const sequence: Sequence = createEmptySequence();
      const offset = 0;
      const index = 1;

      stimulatorProtocol.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index, commandID);

      expect(sequenceProtocolFactory.encodeSequence).toBeCalledWith(sequence, offset, index, commandID);
    });
  });
});
