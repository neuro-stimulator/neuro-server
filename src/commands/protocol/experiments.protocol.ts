import {
  ExperimentCVEP, ExperimentERP, ExperimentFVEP, ExperimentTVEP, TvepOutput,
  outputTypeToRaw,
  CommandToStimulator, FvepOutput,
} from '@stechy1/diplomka-share';
import { numberTo4Bytes } from '../../share/byte.utils';

export interface SerializedExperiment {
  experiment: number[];
  outputs?: number[][];
}

export function serializeExperimentERP(experiment: ExperimentERP, serializedExperiment: SerializedExperiment): void {
}

export function serializeExperimentCVEP(experiment: ExperimentCVEP, serializedExperiment: SerializedExperiment): void {
  serializedExperiment.experiment.push(experiment.outputCount);                   // 1 byte
  serializedExperiment.experiment.push(outputTypeToRaw(experiment.usedOutputs));  // 1 byte
  serializedExperiment.experiment.push(experiment.out);                           // 1 byte
  serializedExperiment.experiment.push(experiment.wait);                          // 1 byte
  serializedExperiment.experiment.push(experiment.bitShift);                      // 1 byte
  serializedExperiment.experiment.push(experiment.brightness);                    // 1 byte
  serializedExperiment.experiment.push(...numberTo4Bytes(experiment.pattern));    // 4 byte
}

export function serializeExperimentFVEP(experiment: ExperimentFVEP, serializedExperiment: SerializedExperiment): void {
  serializedExperiment.experiment.push(experiment.outputCount);

  for (let i = 0; i < experiment.outputCount; i++) {
    const output: FvepOutput = experiment.outputs[i];
    const serializedOutput: number[] = [];

    serializedOutput.push(CommandToStimulator.COMMAND_OUTPUT_SETUP);    // 1 byte
    serializedOutput.push(i);                                           // 1 byte
    serializedOutput.push(outputTypeToRaw(output.outputType));          // 1 byte
    serializedOutput.push(...numberTo4Bytes(output.frequency));         // 4 byte
    serializedOutput.push(...numberTo4Bytes(output.dutyCycle));         // 4 byte
    serializedOutput.push(output.brightness);                           // 1 byte
    serializedOutput.push(CommandToStimulator.COMMAND_DELIMITER);       // 1 byte

    serializedExperiment.outputs[i] = serializedOutput;                 // 13 byte
  }
}

export function serializeExperimentTVEP(experiment: ExperimentTVEP, serializedExperiment: SerializedExperiment): void {
  serializedExperiment.experiment.push(experiment.outputCount);

  for (let i = 0; i < experiment.outputCount; i++) {
    const output: TvepOutput = experiment.outputs[i];
    const serializedOutput: number[] = [];

    serializedOutput.push(CommandToStimulator.COMMAND_OUTPUT_SETUP);    // 1 byte
    serializedOutput.push(i);                                           // 1 byte
    serializedOutput.push(output.patternLength);                        // 1 byte
    serializedOutput.push(outputTypeToRaw(output.outputType));          // 1 byte
    serializedOutput.push(output.out);                                  // 1 byte
    serializedOutput.push(output.wait);                                 // 1 byte
    serializedOutput.push(output.brightness);                           // 1 byte
    serializedOutput.push(...numberTo4Bytes(output.pattern));           // 4 byte
    serializedOutput.push(CommandToStimulator.COMMAND_DELIMITER);       // 1 byte

    serializedExperiment.outputs[i] = serializedOutput;                 // 12 byte
  }
}
