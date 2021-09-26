import DoneCallback = jest.DoneCallback;

import { CommandToStimulator, createEmptyExperimentREA, ExperimentREA, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';
import { ExperimentReaProtocol } from './experiment-rea.protocol';

describe('Experiment REA protocol', () => {

  const TOTAL_OUTPUT_COUNT = 8;

  let experiment: ExperimentREA;
  let experimentProtocol: ExperimentProtocol;

  beforeEach(() => {
    experiment = createEmptyExperimentREA();
    experimentProtocol = new ExperimentReaProtocol(experiment);
  })

  it('positive - should encode REA experiment', (done: DoneCallback) => {
    const commandID = 0;
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    let offset = 0;

    try {
      expect(buffer.length).toBe(34);
      expect(buffer.readUInt8(offset++)).toBe(commandID);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD);
      expect(buffer.readUInt8(offset++)).toBe(experiment.type);

      expect(buffer.readUInt8(offset++)).toBe(experiment.outputCount);
      expect(buffer.readUInt8(offset++)).toBe(outputTypeToRaw(experiment.usedOutputs));
      expect(buffer.readUInt8(offset++)).toBe(experiment.cycleCount);
      expect(buffer.readUInt32LE(offset)).toBe(experiment.waitTimeMin * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(experiment.waitTimeMax * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(experiment.missTime * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt8(offset++)).toBe(experiment.onFail);
      expect(buffer.readUInt8(offset++)).toBe(experiment.brightness);

      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
    } catch (error) {
      done({ message: `Offset: ${offset} - ${error}` });
      return;
    }
    done();
  });

  it('positive - should decode REA experiment', () => {
    const commandID = 0;
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    const decodedExperiment: ExperimentREA = experimentProtocol.decodeExperiment<ExperimentREA>(buffer);

    expect(decodedExperiment).toEqual(
      expect.objectContaining<Partial<ExperimentREA>>({
        type: experiment.type,
        outputCount: experiment.outputCount,
        usedOutputs: experiment.usedOutputs,
        waitTimeMin: experiment.waitTimeMin,
        waitTimeMax: experiment.waitTimeMax,
        missTime: experiment.missTime,
        onFail: experiment.onFail,
        brightness: experiment.brightness
      })
    );
  });

});
