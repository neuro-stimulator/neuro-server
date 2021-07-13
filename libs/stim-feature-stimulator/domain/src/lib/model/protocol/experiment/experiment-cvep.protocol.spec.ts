import DoneCallback = jest.DoneCallback;

import { CommandToStimulator, createEmptyExperimentCVEP, ExperimentCVEP, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';
import { ExperimentCvepProtocol } from './experiment-cvep.protocol';

describe('Experiment CVEP protocol', () => {

  const TOTAL_OUTPUT_COUNT = 8;

  let experiment: ExperimentCVEP;
  let experimentProtocol: ExperimentProtocol;

  beforeEach(() => {
    experiment = createEmptyExperimentCVEP();
    experimentProtocol = new ExperimentCvepProtocol(experiment);
  })

  it('positive - should encode CVEP experiment', (done: DoneCallback) => {
    const commandID = 0;
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    let offset = 0;

    try {
      expect(buffer.length).toBe(29);
      expect(buffer.readUInt8(offset++)).toBe(commandID);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD);
      expect(buffer.readUInt8(offset++)).toBe(experiment.type);

      expect(buffer.readUInt8(offset++)).toBe(experiment.outputCount);
      expect(buffer.readUInt8(offset++)).toBe(outputTypeToRaw(experiment.usedOutputs));
      expect(buffer.readUInt32LE(offset)).toBe(experiment.out * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(experiment.wait * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt8(offset++)).toBe(experiment.bitShift);
      expect(buffer.readUInt8(offset++)).toBe(experiment.brightness);
      expect(buffer.readUInt32LE(offset)).toBe(experiment.pattern);
      offset += 4;

      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
    } catch (error) {
      done({ message: `Offset: ${offset} - ${error}` });
      return;
    }

    done();

  });

  it('positive - should decode CVEP experiment', () => {
    const commandID = 0;
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    const decodedExperiment: ExperimentCVEP = experimentProtocol.decodeExperiment<ExperimentCVEP>(buffer);

    expect(decodedExperiment).toEqual(
      expect.objectContaining<Partial<ExperimentCVEP>>({
        type: experiment.type,
        outputCount: experiment.outputCount,
        usedOutputs: experiment.usedOutputs,
        out: experiment.out,
        wait: experiment.wait,
        bitShift: experiment.bitShift,
        brightness: experiment.brightness,
        pattern: experiment.pattern
      })
    );
  });

});
