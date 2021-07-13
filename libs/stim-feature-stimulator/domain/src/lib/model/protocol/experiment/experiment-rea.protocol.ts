import { Logger } from '@nestjs/common';

import { createEmptyExperimentREA, Experiment, ExperimentREA, Output, outputTypeFromRaw, outputTypeToRaw } from '@stechy1/diplomka-share';

import { ExperimentProtocol } from './experiment.protocol';

export class ExperimentReaProtocol extends ExperimentProtocol {

  constructor(readonly experiment?: ExperimentREA) {
    super(new Logger(ExperimentReaProtocol.name), experiment);
  }

  protected writeExperimentBody(): void {
    this.logger.verbose('Serializuji REA.');
    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
    this.serializedExperiment.experiment.writeUInt8(outputTypeToRaw(this.experiment.usedOutputs), this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt8(this.experiment.cycleCount, this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.waitTimeMin * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset);
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.waitTimeMax * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset);
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(this.experiment.missTime * 1000, this.serializedExperiment.offset); // 4 byte
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt32LE(0, this.serializedExperiment.offset);
    this.serializedExperiment.offset += 4;
    this.serializedExperiment.experiment.writeUInt8(this.experiment.onFail, this.serializedExperiment.offset++); // 1 byte
    this.serializedExperiment.experiment.writeUInt8(this.experiment.brightness, this.serializedExperiment.offset++); // 1 byte

    this.logger.verbose(`[${this.serializedExperiment.experiment.subarray(0, this.serializedExperiment.offset).join(',')}]`);
  }

  protected readExperimentBody<T extends Experiment<Output>>(experiment: T): void {
    (experiment as unknown as ExperimentREA).usedOutputs = outputTypeFromRaw(this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++));
    (experiment as unknown as ExperimentREA).cycleCount = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    (experiment as unknown as ExperimentREA).waitTimeMin = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentREA).waitTimeMax = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentREA).missTime = this.serializedExperiment.experiment.readUInt32LE(this.serializedExperiment.offset) / 1000;
    this.serializedExperiment.offset += 8;
    (experiment as unknown as ExperimentREA).onFail = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
    (experiment as unknown as ExperimentREA).brightness = this.serializedExperiment.experiment.readUInt8(this.serializedExperiment.offset++);
  }

  protected createEmptyExperiment<T extends Experiment<Output>>(): T {
    return createEmptyExperimentREA() as unknown as T;
  }

}
