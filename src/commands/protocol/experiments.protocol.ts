import { ExperimentCVEP, ExperimentERP, ExperimentFVEP, ExperimentTVEP, TvepOutput } from 'diplomka-share';

export function serializeExperimentERP(experiment: ExperimentERP): number[] {
  const bytes: number[] = [];


  return bytes;
}

export function serializeExperimentCVEP(experiment: ExperimentCVEP): number[] {
  return [
    experiment.outputCount,       // 1 byte
    experiment.out,               // 1 byte
    experiment.wait,              // 1 byte
    experiment.bitShift,          // 1 byte
    experiment.brightness,        // 1 byte
    ((experiment.pattern >> 24) & 0xFF),     // 1 byte
    ((experiment.pattern >> 16) & 0xFF),     // 1 byte
    ((experiment.pattern >> 8) & 0xFF),      // 1 byte
    ((experiment.pattern >> 0) & 0xFF),           // 1 byte
  ];
}

export function serializeExperimentFVEP(experiment: ExperimentFVEP): number[] {
  const bytes: number[] = [];


  return bytes;
}

export function serializeExperimentTVEP(experiment: ExperimentTVEP): number[] {
  const bytes: number[] = [];
  bytes.push(experiment.outputCount);
  for (let i = 0; i < experiment.outputCount; i++) {
    const output: TvepOutput = experiment.outputs[i];
    bytes.push(
      output.patternLength,               // 1 byte
      output.out,                         // 1 byte
      output.wait,                        // 1 byte
      output.brightness,                  // 1 byte
      ((output.pattern >> 24) & 0xFF),    // 1 byte
      ((output.pattern >> 16) & 0xFF),    // 1 byte
      ((output.pattern >> 8) & 0xFF),     // 1 byte
      ((output.pattern >> 0) & 0xFF),     // 1 byte
      );
  }

  return bytes;
}
