import { ExperimentCVEP, ExperimentERP, ExperimentFVEP, ExperimentTVEP, TvepOutput,
  CommandToStimulator } from '@stechy1/diplomka-share';

export interface SerializedExperiment {
  experiment: number[];
  outputs?: number[][];
}

export function serializeExperimentERP(experiment: ExperimentERP, serializedExperiment: SerializedExperiment): void {
}

export function serializeExperimentCVEP(experiment: ExperimentCVEP, serializedExperiment: SerializedExperiment): void {
  serializedExperiment.experiment.push(
    experiment.outputCount,       // 1 byte
    experiment.out,               // 1 byte
    experiment.wait,              // 1 byte
    experiment.bitShift,          // 1 byte
    experiment.brightness,        // 1 byte
    ((experiment.pattern >> 24) & 0xFF),     // 1 byte
    ((experiment.pattern >> 16) & 0xFF),     // 1 byte
    ((experiment.pattern >> 8) & 0xFF),      // 1 byte
    ((experiment.pattern >> 0) & 0xFF),           // 1 byte
  );
}

export function serializeExperimentFVEP(experiment: ExperimentFVEP, serializedExperiment: SerializedExperiment): void {
}

export function serializeExperimentTVEP(experiment: ExperimentTVEP, serializedExperiment: SerializedExperiment): void {
  serializedExperiment.experiment.push(experiment.outputCount);

  for (let i = 0; i < experiment.outputCount; i++) {
    const output: TvepOutput = experiment.outputs[i];
    serializedExperiment.outputs[i] = [];
    serializedExperiment.outputs[i].push(CommandToStimulator.COMMAND_OUTPUT_SETUP);
    serializedExperiment.outputs[i].push(i);
    serializedExperiment.outputs[i].push(
      output.patternLength,               // 1 byte
      output.out,                         // 1 byte
      output.wait,                        // 1 byte
      output.brightness,                  // 1 byte
      ((output.pattern >> 24) & 0xFF),    // 1 byte
      ((output.pattern >> 16) & 0xFF),    // 1 byte
      ((output.pattern >> 8) & 0xFF),     // 1 byte
      ((output.pattern >> 0) & 0xFF),     // 1 byte
      );
    serializedExperiment.outputs[i].push(CommandToStimulator.COMMAND_DELIMITER);
  }
}
