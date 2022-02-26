import DoneCallback = jest.DoneCallback;

import { CommandToStimulator, createEmptyExperimentTVEP, createEmptyOutputTVEP, ExperimentTVEP, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentTvepProtocol } from './experiment-tvep.protocol';
import { ExperimentProtocol } from './experiment.protocol';

describe('Experiment TVEP protocol', () => {

  const TOTAL_OUTPUT_COUNT = 8;

  let experiment: ExperimentTVEP;
  let experimentProtocol: ExperimentProtocol;

  beforeEach(() => {
    experiment = createEmptyExperimentTVEP();
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    experiment.outputs = new Array(experiment.outputCount).fill(0).map((value, index: number) => createEmptyOutputTVEP(experiment, index));
    experimentProtocol = new ExperimentTvepProtocol(experiment);
  })

  it('positive - should encode TVEP experiment', (done: DoneCallback) => {
    const commandID = 0;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    let offset = 0;

    try {
      // 6 =  základní data o experimentu
      // 27 = data pro každý výstup
      expect(buffer.length).toBe(6 + 27 * experiment.outputCount);
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

        expect(buffer.readUInt8(offset++)).toBe(experiment.outputs[i].patternLength);
        expect(buffer.readUInt8(offset++)).toBe(outputTypeToRaw(experiment.outputs[i].outputType));
        expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.outputs[i].out) * 1000);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(0);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.outputs[i].wait) * 1000);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(0);
        offset += 4;
        expect(buffer.readUInt8(offset++)).toBe(experiment.outputs[i].brightness);
        expect(buffer.readUInt32LE(offset)).toBe(experiment.outputs[i].pattern);
        offset += 4;

        expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);
      }
    } catch (error) {
      done({ message: `Offset: ${offset} - ${error}` });
      return;
    }

    done();

  })

  it('positive - should decode TVEP experiment', () => {
    const commandID = 0;
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID);
    const decodedExperiment: ExperimentTVEP = experimentProtocol.decodeExperiment<ExperimentTVEP>(buffer);

    expect(decodedExperiment).toEqual(
      expect.objectContaining<Partial<ExperimentTVEP>>({
        type: experiment.type,
        outputCount: experiment.outputCount,
        usedOutputs: experiment.usedOutputs,
      })
    );
  });

});
