import {
  ExperimentCVEP, ExperimentERP, ExperimentFVEP, ExperimentTVEP, TvepOutput,
  outputTypeToRaw,
  CommandToStimulator, FvepOutput,
} from '@stechy1/diplomka-share';
import { numberTo4Bytes } from '../../share/byte.utils';
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger('ExperimentsProtocol');

export interface SerializedExperiment {
  offset: number;
  experiment: Buffer;
  outputs?: {
    offset: number;
    output: Buffer;
  }[];
}

export function serializeExperimentERP(experiment: ExperimentERP, serializedExperiment: SerializedExperiment): void {
}

export function serializeExperimentCVEP(experiment: ExperimentCVEP, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji CVEP.');
  logger.verbose(serializedExperiment.experiment);
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);                   // 1 byte
  serializedExperiment.experiment.writeUInt8(outputTypeToRaw(experiment.usedOutputs), serializedExperiment.offset++);  // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.out, serializedExperiment.offset++);                           // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.wait, serializedExperiment.offset++);                          // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.bitShift, serializedExperiment.offset++);                      // 1 byte
  serializedExperiment.experiment.writeUInt8(experiment.brightness, serializedExperiment.offset++);                    // 1 byte
  serializedExperiment.experiment.writeUInt32LE(experiment.pattern, serializedExperiment.offset);                      // 4 byte
  // tslint:disable-next-line:align
                                                                    serializedExperiment.offset += 4;
  logger.verbose(serializedExperiment.experiment);
}

export function serializeExperimentFVEP(experiment: ExperimentFVEP, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji FVEP.');
  logger.verbose(serializedExperiment.experiment);
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);

  for (let i = 0; i < experiment.outputCount; i++) {
    logger.verbose(`Serializuji: ${i}. výstup.`);
    const output: FvepOutput = experiment.outputs[i];
    const serializedOutput: Buffer = Buffer.alloc(13, 0);
    let offset = 0;

    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++);    // 1 byte
    serializedOutput.writeUInt8(i, offset++);                                           // 1 byte
    serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++);          // 1 byte
    serializedOutput.writeFloatLE(output.timeOn, offset);   offset += 4;               // 4 byte
    serializedOutput.writeFloatLE(output.timeOff, offset);  offset += 4;               // 4 byte
    serializedOutput.writeUInt8(output.brightness, offset++);                           // 1 byte
    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++);       // 1 byte

    serializedExperiment.outputs[i] = {offset, output: serializedOutput};               // 13 byte
    logger.verbose(serializedOutput);
  }
  logger.verbose(serializedExperiment.experiment);
}

export function serializeExperimentTVEP(experiment: ExperimentTVEP, serializedExperiment: SerializedExperiment): void {
  logger.verbose('Serializuji TVEP.');
  logger.verbose(serializedExperiment.experiment);
  serializedExperiment.experiment.writeUInt8(experiment.outputCount, serializedExperiment.offset++);

  for (let i = 0; i < experiment.outputCount; i++) {
    logger.verbose(`Serializuji: ${i}. výstup.`);
    const output: TvepOutput = experiment.outputs[i];
    const serializedOutput: Buffer = Buffer.alloc(12, 0);
    let offset = 0;

    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_OUTPUT_SETUP, offset++);    // 1 byte
    serializedOutput.writeUInt8(i, offset++);                                           // 1 byte
    serializedOutput.writeUInt8(output.patternLength, offset++);                        // 1 byte
    serializedOutput.writeUInt8(outputTypeToRaw(output.outputType), offset++);          // 1 byte
    serializedOutput.writeUInt8(output.out, offset++);                                  // 1 byte
    serializedOutput.writeUInt8(output.wait, offset++);                                 // 1 byte
    serializedOutput.writeUInt8(output.brightness, offset++);                           // 1 byte
    if (output.pattern > 0) {
      serializedOutput.writeUInt32LE(output.pattern, offset);                           // 4 byte
    } else {
      serializedOutput.writeInt32LE(output.pattern, offset);                            // 4 byte
    }
    offset += 4;
    serializedOutput.writeUInt8(CommandToStimulator.COMMAND_DELIMITER, offset++);       // 1 byte

    serializedExperiment.outputs[i] = {offset, output: serializedOutput};               // 12 byte
    logger.verbose(serializedOutput);
  }
  logger.verbose(serializedExperiment.experiment);
}
