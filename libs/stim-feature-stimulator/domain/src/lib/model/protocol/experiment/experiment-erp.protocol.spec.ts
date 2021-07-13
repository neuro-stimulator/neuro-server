import DoneCallback = jest.DoneCallback;

import { CommandToStimulator, createEmptyExperimentERP, createEmptyOutputERP, createEmptySequence, ExperimentERP, outputTypeToRaw, Sequence } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';
import { ExperimentErpProtocol } from './experiment-erp.protocol';

describe('Experiment ERP protocol', () => {

  const TOTAL_OUTPUT_COUNT = 1;

  let experiment: ExperimentERP;
  let experimentProtocol: ExperimentProtocol;

  beforeEach(() => {
    experiment = createEmptyExperimentERP();
    experiment.outputCount = TOTAL_OUTPUT_COUNT;
    experiment.outputs = new Array(experiment.outputCount).fill(0).map((value, index: number) => createEmptyOutputERP(experiment, index));
    experimentProtocol = new ExperimentErpProtocol(experiment);
  })

  it('positive - should encode ERP experiment', (done: DoneCallback) => {
    const commandID = 0;
    const sequence: Sequence = createEmptySequence();
    sequence.size = 20;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID, sequence.size);
    let offset = 0;

    try {
      // 26 =  základní data o experimentu
      // 22 = data pro každý výstup
      expect(buffer.length).toBe(26 + 22 * experiment.outputCount);
      expect(buffer.readUInt8(offset++)).toBe(commandID);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT);
      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_MANAGE_EXPERIMENT_UPLOAD);
      expect(buffer.readUInt8(offset++)).toBe(experiment.type);

      expect(buffer.readUInt8(offset++)).toBe(experiment.outputCount);
      expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.out) * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.wait) * 1000);
      offset += 4;
      expect(buffer.readUInt32LE(offset)).toBe(0);
      offset += 4;
      expect(buffer.readUInt8(offset++)).toBe(experiment.random);
      expect(buffer.readUInt8(offset++)).toBe(experiment.edge);
      expect(buffer.readUInt16LE(offset)).toBe(sequence.size);
      offset += 2;

      expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_DELIMITER);

      for (let i = 0; i < experiment.outputCount; i++) {
        expect(buffer.readUInt8(offset++)).toBe(commandID);
        expect(buffer.readUInt8(offset++)).toBe(CommandToStimulator.COMMAND_OUTPUT_SETUP);
        expect(buffer.readUInt8(offset++)).toBe(i);

        expect(buffer.readUInt8(offset++)).toBe(outputTypeToRaw(experiment.outputs[i].outputType));
        expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.outputs[i].pulseUp) * 1000);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(0);
        offset += 4;
        expect(buffer.readUInt32LE(offset)).toBe(Math.round(experiment.outputs[i].pulseDown) * 1000);
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

    it('positive - should decode ERP experiment', () => {
    const commandID = 0;
    const sequenceSize = 10;
    const buffer: Buffer = experimentProtocol.encodeExperiment(commandID, sequenceSize);
    const decodedExperiment: ExperimentERP = experimentProtocol.decodeExperiment<ExperimentERP>(buffer);

    expect(decodedExperiment).toEqual(
      expect.objectContaining<Partial<ExperimentERP>>({
        type: experiment.type,
        outputCount: experiment.outputCount,
        usedOutputs: experiment.usedOutputs,
        out: experiment.out,
        wait: experiment.wait,
        random: experiment.random,
        edge: experiment.edge,
      })
    );
  });

});
