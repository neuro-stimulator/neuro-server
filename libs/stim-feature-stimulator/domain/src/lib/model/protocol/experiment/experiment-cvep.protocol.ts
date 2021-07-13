import { Logger } from '@nestjs/common';

import { createEmptyExperimentCVEP, Experiment, ExperimentCVEP, Output, outputTypeFromRaw, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';

export class ExperimentCvepProtocol extends ExperimentProtocol {

  constructor(readonly experiment?: ExperimentCVEP) {
    super(new Logger(ExperimentCvepProtocol.name), experiment);
  }

  protected writeExperimentBody(): void {
    this.logger.verbose('Serializuji CVEP.');
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
    this.serializedExperiment.experiment.writeUInt8(outputTypeToRaw(this.experiment.usedOutputs), this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.out * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.wait * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt8(this.experiment.bitShift, this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt8(this.experiment.brightness, this.serializedExperiment.offset++); // 1 byte
    if (this.experiment.pattern < 0) {
      this.serializedExperiment.experiment.writeInt32LE(this.experiment.pattern, this.serializedExperiment.offset); // 4 byte
    } else {
      this.serializedExperiment.experiment.writeUInt32LE(this.experiment.pattern, this.serializedExperiment.offset); // 4 byte
    }
    this.serializedExperiment.offset += 4;
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
  }

  protected readExperimentBody<T extends Experiment<Output>>(experiment: T): void {
    experiment.usedOutputs = outputTypeFromRaw(this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++));
    (experiment as unknown as ExperimentCVEP).out = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentCVEP).wait = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentCVEP).bitShift = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    (experiment as unknown as ExperimentCVEP).brightness = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    (experiment as unknown as ExperimentCVEP).pattern = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset);
    this.serializedExperiment.offset += 4;
  }

  protected createEmptyExperiment<T extends Experiment<Output>>(): T {
    return createEmptyExperimentCVEP() as unknown as T;
  }

}
