import { Logger } from '@nestjs/common';

import {
  CommandToStimulator,
  createEmptyExperimentFVEP,
  createEmptyOutputFVEP,
  Experiment,
  ExperimentFVEP,
  FvepOutput,
  Output,
  outputTypeFromRaw,
  outputTypeToRaw
} from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';

export class ExperimentFvepProtocol extends ExperimentProtocol {

  constructor(readonly experiment?: ExperimentFVEP) {
    super(new Logger(ExperimentFvepProtocol.name), experiment);
  }

  protected writeExperimentBody(): void {
    this.logger.verbose('Serializuji FVEP.');
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);

    for (let i = 0; i < this.experiment.outputCount; i++) {
      this.logger.verbose(`Serializuji: ${i}. výstup.`);
      const output: FvepOutput = this.experiment.outputs[i];
      const serializedOutput: Buffer = Buffer.alloc(22, 0);
      let offset = 0;

      serializedOutput.writeUInt8(this.commandID, offset++); // 1 byte
      serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++); // 1 byte
      serializedOutput.writeUInt8(i, offset++); // 1 byte
      serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++); // 1 byte
      serializedOutput.writeUInt32LE(Math.round(output.timeOn) * 1000, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(0, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(Math.round(output.timeOff) * 1000, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(0, offset);
      offset += 4; // 4 byte
      serializedOutput.writeUInt8(output.brightness, offset++); // 1 byte
      serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++); // 1 byte

      this.serializedExperiment.outputs[i] = { offset, output: serializedOutput }; // 22 byte
      this.logger.verbose(`[${serializedOutput.join(',')}]`);
    }
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
  }

  protected readExperimentBody<T extends Experiment<Output>>(experiment: T): void {
    // Přeskočení delimiteru pro samotný experiment
    this.serializedExperiment.offset += 1;
    for (let i = 0; i < experiment.outputCount; i++) {
      const output: FvepOutput = createEmptyOutputFVEP(experiment as unknown as ExperimentFVEP, i);
      // Přeskočení hlavičky pro jeden výstup
      this.serializedExperiment.offset += 3;

      output.outputType = outputTypeFromRaw(this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++));
      output.timeOn = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset);
      this.serializedExperiment.offset += 8;
      output.timeOff = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset);
      this.serializedExperiment.offset += 8;
      output.brightness = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
      // Přeskočení delimiteru výstupu
      this.serializedExperiment.offset++;

      (experiment as unknown as ExperimentFVEP).outputs.push(output);
    }
  }

  protected createEmptyExperiment<T extends Experiment<Output>>(): T {
    return createEmptyExperimentFVEP() as unknown as T;
  }

}
