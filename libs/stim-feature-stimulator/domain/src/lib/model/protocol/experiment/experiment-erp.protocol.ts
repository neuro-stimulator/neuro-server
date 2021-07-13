import { Logger } from '@nestjs/common';

import { CommandToStimulator, createEmptyExperimentERP, createEmptyOutputERP, ErpOutput, Experiment, ExperimentERP, Output, outputTypeFromRaw, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';

export class ExperimentErpProtocol extends ExperimentProtocol {

  constructor(readonly experiment?: ExperimentERP) {
    super(new Logger(ExperimentErpProtocol.name), experiment);
  }

  protected writeExperimentBody(sequenceSize: number): void {
    this.logger.verbose('Serializuji ERP.');
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.out * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset);
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.wait * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset);
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt8(this.experiment.random, this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt8(this.experiment.edge, this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt16LE(sequenceSize, this.serializedExperiment.offset); // 1 byte
    this.serializedExperiment.offset += 2;
    for (let i = 0; i < this.experiment.outputCount; i++) {
      this.logger.verbose(`Serializuji: ${i}. výstup.`);
      const output: ErpOutput = this.experiment.outputs[i];
      const serializedOutput: Buffer = Buffer.alloc(22, 0);
      let offset = 0;

      serializedOutput.writeUInt8(this.commandID, offset++); // 1 byte
      serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++); // 1 byte
      serializedOutput.writeUInt8(i, offset++); // 1 byte
      serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++); // 1 byte
      serializedOutput.writeUInt32LE(output.pulseUp * 1000, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(0, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(output.pulseDown * 1000, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt32LE(0, offset); // 4 byte
      offset += 4;
      serializedOutput.writeUInt8(output.brightness, offset++); // 1 byte
      serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++); // 1 byte

      this.serializedExperiment.outputs[i] = { offset, output: serializedOutput }; // 22 byte
      this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
    }
  }

  protected readExperimentBody<T extends Experiment<Output>>(experiment: T): void {
    (experiment as unknown as ExperimentERP).out = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentERP).wait = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentERP).random = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    (experiment as unknown as ExperimentERP).edge = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    // Přeskočení velikosti sekvence (2), přeskočení delimiteru pro samotný experiment
    this.serializedExperiment.offset += 3;

    for (let i = 0; i < experiment.outputCount; i++) {
      const output: ErpOutput = createEmptyOutputERP(experiment as unknown as ExperimentERP, i);
      // Přeskočení hlavičky pro jeden výstup
      this.serializedExperiment.offset += 3;

      output.outputType = outputTypeFromRaw(this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++));
      output.pulseUp = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset);
      this.serializedExperiment.offset += 8;
      output.pulseDown = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset);
      this.serializedExperiment.offset += 8;
      output.brightness = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
      // Přeskočení delimiteru výstupu
      this.serializedExperiment.offset++;


      (experiment as unknown as ExperimentERP).outputs.push(output);
    }
  }



  protected createEmptyExperiment<T extends Experiment<Output>>(): T {
    return createEmptyExperimentERP() as unknown as T;
  }

}
