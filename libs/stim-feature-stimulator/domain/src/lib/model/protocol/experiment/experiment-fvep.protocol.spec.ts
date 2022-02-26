import { CommandToStimulator, createEmptyExperimentFVEP, createEmptyOutputFVEP, ExperimentFVEP, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentFvepProtocol } from './experiment-fvep.protocol';
import { ExperimentProtocol } from './experiment.protocol';

import DoneCallback = jest.DoneCallback;

describe('Experiment FVEP protocol', () => {

  const TOTAL_OUTPUT_COUNT = 8;

  let experiment: ExperimentFVEP;
  let experimentProtocol: ExperimentProtocol;

  beforeEach(() => {
    experiment = createEmptyExperimentFVEP();
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    experiment.outputs = new Array(experiment.outputCount).fill(0).map((value, index: number) => createEmptyOutputFVEP(experiment, index));
    experimentProtocol = new ExperimentFvepProtocol(experiment);
  })

  it('positive - should encode FVEP experiment', (done: DoneCallback) => {
    const commandID = 0;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    let offset = 0;

    try {
      // 6 =  základní data o experimentu
      // 22 = data pro každý výstup
      expect(buffer.length).toBe(6 + 22 * experiment.outputCount);
      expect(buffer.readUInt8(offset++)).toBe(commandID);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD);
      expect(buffer.readUInt8(offset++)).toBe(experiment.type);

      expect(buffer.readUInt8(offset++)).toBe(experiment.outputCount);

      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);

      for (let i = 0; i < experiment.outputCount; i++) {
        expect(buffer.readUInt8(offset++)).toBe(commandID);
        expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_OUTPUT_SETUP);
        expect(buffer.readUInt8(offset++)).toBe(i);

        expect(buffer.readUInt8(offset++)).toBe(outputTypeToRaw(experiment.outputs[i].outputType));
        expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.outputs[i].timeOn) * 1000);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(0);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.outputs[i].timeOff) * 1000);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(0);
        offset += 4;
        expect(buffer.readUInt8(offset++)).toBe(experiment.outputs[i].brightness);

        expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
      }
    } catch (error) {
      done({ message: `Offset: ${offset} - ${error}` });
      return;
    }
    done();
  });

  it('positive - should decode FVEP experiment', () => {
    const commandID = 0;
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    const decodedExperiment: ExperimentFVEP = experimentProtocol.decodeExperiment<ExperimentFVEP>(buffer);

    expect(decodedExperiment).toEqual(
      expect.objectContaining<Partial<ExperimentFVEP>>({
        type: experiment.type,
        outputCount: experiment.outputCount,
        usedOutputs: experiment.usedOutputs,
      })
    );
  });

});
