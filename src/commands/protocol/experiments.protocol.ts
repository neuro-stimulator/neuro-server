import { Logger } from '@nestjs/common';

import {
  CommandToStimulator, ErpOutput, ExperimentCVEP, ExperimentERP, ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP, FvepOutput, outputTypeToRaw, Sequence, TvepOutput,
} from '@stechy1/diplomka-share';

const logger: Logger = new Logger('ExperimentsProtocol');

export interface SerializedExperiment {
  offset: number;
  experiment: Buffer;
  outputs?: {
    offset: number;
    output: Buffer;
  }[];
}

export interface SerializedSequence {
  offset: number;
  sequence: Buffer;
}

export function serializeExperimentERP(experiment: ExperimentERP, sequence: Sequence, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji ERP.');
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);                   // 1 byte
  // serializedExperiment.experiment.writeUInt8(experiment.out, serializedExperiment.offset++);                        // 1 byte
  serializedExperiment.experiment.writeUInt32LE(experiment.out * 1000, serializedExperiment.offset);             // 4 byte
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt32LE(0, serializedExperiment.offset);
  serializedExperiment.offset += 4;
  // serializedExperiment.experiment.writeUInt8(experiment.wait, serializedExperiment.offset++);                       // 1 byte
  serializedExperiment.experiment.writeUInt32LE(experiment.wait * 1000, serializedExperiment.offset);            // 4 byte
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt32LE(0, serializedExperiment.offset);
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt8(experiment.random, serializedExperiment.offset++);                        // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.edge, serializedExperiment.offset++);                          // 1 byte
  serializedExperiment.experiment.writeUInt16LE(sequence.size, serializedExperiment.offset);                           // 1 byte
  // tslint:disable-next-line:align
                                                               serializedExperiment.offset += 2;
  for (let i = 0; i < experiment.outputCount; i++) {
    logger.verbose(`Serializuji: ${i}. výstup.`);
    const output: ErpOutput = experiment.outputs[i];
    const serializedOutput: Buffer = Buffer.alloc(21, 0);
    let offset = 0;

    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++);    // 1 byte
    serializedOutput.writeUInt8(i, offset++);                                           // 1 byte
    serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++);          // 1 byte
    serializedOutput.writeUInt32LE(output.pulseUp * 1000, offset);                             // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(0, offset);                                    // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(output.pulseDown * 1000, offset);                            // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(0, offset);                                    // 4 byte
    offset += 4;
    serializedOutput.writeUInt8(output.brightness, offset++);                           // 1 byte
    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++);       // 1 byte

    serializedExperiment.outputs[i] = {offset, output: serializedOutput};               // 21 byte
    logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
  }

}

export function serializeExperimentCVEP(experiment: ExperimentCVEP, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji CVEP.');
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);                   // 1 byte
  serializedExperiment.experiment.writeUInt8(outputTypeToRaw(experiment.usedOutputs), serializedExperiment.offset++);  // 1 byte
  serializedExperiment.experiment.writeUInt32LE(experiment.out * 1000, serializedExperiment.offset);              // 4 byte
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt32LE(0, serializedExperiment.offset);                                 // 4 byte
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt32LE(experiment.wait * 1000, serializedExperiment.offset);             // 4 byte
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt32LE(0, serializedExperiment.offset);                                 // 4 byte
  serializedExperiment.offset += 4;
  serializedExperiment.experiment.writeUInt8(experiment.bitShift, serializedExperiment.offset++);                      // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.brightness, serializedExperiment.offset++);                    // 1 byte
  if (experiment.pattern < 0) {
    serializedExperiment.experiment.writeInt32LE(experiment.pattern, serializedExperiment.offset);                     // 4 byte
  } else {
    serializedExperiment.experiment.writeUInt32LE(experiment.pattern, serializedExperiment.offset);                    // 4 byte
  }
  // tslint:disable-next-line:align
                                                                    serializedExperiment.offset += 4;
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
}

export function serializeExperimentFVEP(experiment: ExperimentFVEP, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji FVEP.');
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);

  for (let i = 0; i < experiment.outputCount; i++) {
    logger.verbose(`Serializuji: ${i}. výstup.`);
    const output: FvepOutput = experiment.outputs[i];
    const serializedOutput: Buffer = Buffer.alloc(21, 0);
    let offset = 0;

    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++);    // 1 byte
    serializedOutput.writeUInt8(i, offset++);                                           // 1 byte
    serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++);          // 1 byte
    serializedOutput.writeUInt32LE(Math.round(output.timeOn) * 1000, offset);     // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(0, offset);                                    // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(Math.round(output.timeOff) * 1000, offset);    // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(0, offset);   offset += 4;                     // 4 byte
    serializedOutput.writeUInt8(output.brightness, offset++);                           // 1 byte
    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++);       // 1 byte

    serializedExperiment.outputs[i] = {offset, output: serializedOutput};               // 21 byte
    logger.verbose(serializedOutput);
  }
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
}

export function serializeExperimentTVEP(experiment: ExperimentTVEP, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji TVEP.');
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);

  for (let i = 0; i < experiment.outputCount; i++) {
    logger.verbose(`Serializuji: ${i}. výstup.`);
    const output: TvepOutput = experiment.outputs[i];
    const serializedOutput: Buffer = Buffer.alloc(26, 0);
    let offset = 0;

    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++);    // 1 byte
    serializedOutput.writeUInt8(i, offset++);                                           // 1 byte
    serializedOutput.writeUInt8(output.patternLength, offset++);                        // 1 byte
    serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++);          // 1 byte
    serializedOutput.writeUInt32LE(output.out * 1000, offset);                    // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(0, offset);                                    // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(output.wait * 1000, offset);                   // 4 byte
    offset += 4;
    serializedOutput.writeUInt32LE(0, offset);                                    // 4 byte
    offset += 4;
    serializedOutput.writeUInt8(output.brightness, offset++);                           // 1 byte
    if (output.pattern > 0) {
      serializedOutput.writeUInt32LE(output.pattern, offset);                           // 4 byte
    } else {
      serializedOutput.writeInt32LE(output.pattern, offset);                            // 4 byte
    }
    offset += 4;
    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++);       // 1 byte

    serializedExperiment.outputs[i] = {offset, output: serializedOutput};               // 30 byte
    logger.verbose(serializedOutput);
  }
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
}

export function serializeExperimentREA(experiment: ExperimentREA, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji TVEP.');
  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);
  serializedExperiment.experiment.writeUInt8(outputTypeToRaw(experiment.usedOutputs), serializedExperiment.offset++);  // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.cycleCount, serializedExperiment.offset++);                    // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.waitTimeMin, serializedExperiment.offset++);                   // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.waitTimeMax, serializedExperiment.offset++);                   // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.missTime, serializedExperiment.offset++);                      // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.onFail, serializedExperiment.offset++);                        // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.brightness, serializedExperiment.offset++);                    // 1 byte

  logger.verbose(serializedExperiment.experiment.subarray(0, serializedExperiment.offset));
}

export function serializeSequence(sequence: Sequence, offset: number, seriaizedSequence: SerializedSequence) {
  const buffer: number[] = sequence.data.slice(offset, Math.min(offset + 8, sequence.data.length));
  // Jednoduché zarovnání na sudý počet čísel
  if ((buffer.length % 2) !== 0) {
    buffer.push(0);
  }

  let int32 = 0;
  for (let i = buffer.length - 1; i >= 0; i--) {
    int32 |= buffer[i] << (4 * i);
  }
  if (int32 < 0) {
    seriaizedSequence.sequence.writeInt32LE(int32, seriaizedSequence.offset);
  } else {
    seriaizedSequence.sequence.writeUInt32LE(int32, seriaizedSequence.offset);
  }
  seriaizedSequence.offset += 4;
}
