import { Logger } from '@nestjs/common';

import { CommandToStimulator, createEmptyExperimentTVEP, Experiment, ExperimentTVEP, TvepOutput, Output, outputTypeToRaw, createEmptyOutputTVEP, outputTypeFromRaw } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';

export class ExperimentTvepProtocol extends ExperimentProtocol {

  constructor(readonly experiment?: ExperimentTVEP) {
    super(new Logger(ExperimentTvepProtocol.name), experiment);
  }

  protected writeExperimentBody(): void {
    this.logger.verbose('Serializuji TVEP.');
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);

    for (let i = 0; i < this.experiment.outputCount; i++) {
      this.logger.verbose(`Serializuji: ${i}. výstup.`);
      const output: TvepOutput = this.experiment.outputs[i];
      const serializedOutput: Buffer = Buffer.alloc(27, 0);
      let offset = 0;

      serializedOutput.writeUInt8(this.commandID, offset++); // 1 byte
      serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++); // 1 byte
      serializedOutput.writeUInt8(i, offset++); // 1 byte
      serializedOutput.writeUInt8(output.patternLength, offset++); // 1 byte
      serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++); // 1 byte
      serializedOutput.writeUInt32LE(output.out * 1000, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(0, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(output.wait * 1000, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(0, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt8(output.brightness, offset++); // 1 byte
      if (output.pattern > 0) {
        serializedOutput.writeUInt32LE(output.pattern, offset); // 4 byte
      } else {
        serializedOutput.writeInt32LE(output.pattern, offset); // 4 byte
      }
      offset += 4;
      serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++); // 1 byte

      this.serializedExperiment.outputs[i] = { offset, output: serializedOutput }; // 31 byte
      this.logger.verbose(`[${serializedOutput.join(',')}]`);
    }
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
  }

  protected readExperimentBody<T extends Experiment<Output>>(experiment: T): void {
    // Přeskočení delimiteru pro samotný experiment
    this.serializedExperiment.offset += 1;
    for (let i = 0; i < experiment.outputCount; i++) {
      const output: TvepOutput = createEmptyOutputTVEP(experiment as unknown as ExperimentTVEP, i);
      // Přeskočení hlavičky pro jeden výstup
      this.serializedExperiment.offset += 3;

      output.patternLength = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
      output.outputType = outputTypeFromRaw(this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++));
      output.out = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
      this.serializedExperiment.offset += 8;
      output.wait = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
      this.serializedExperiment.offset += 8;
      output.brightness = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
      output.pattern = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset);

      // Přeskočení delimiteru výstupu a 4 byty za pattern
      this.serializedExperiment.offset += 5;

      (experiment as unknown as ExperimentTVEP).outputs.push(output);
    }
  }


  protected createEmptyExperiment<T extends Experiment<Output>>(): T {
    return createEmptyExperimentTVEP() as unknown as T;
  }

}
