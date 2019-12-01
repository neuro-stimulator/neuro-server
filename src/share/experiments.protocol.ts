import { ExperimentCVEP, ExperimentERP, ExperimentFVEP, ExperimentTVEP } from 'diplomka-share';

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
    experiment.pattern,           // 1 byte
    experiment.pattern << 8,      // 1 byte
    experiment.pattern << 16,     // 1 byte
    experiment.pattern << 24,     // 1 byte
  ];
}

export function serializeExperimentFVEP(experiment: ExperimentFVEP): number[] {
  const bytes: number[] = [];


  return bytes;
}

export function serializeExperimentTVEP(experiment: ExperimentTVEP): number[] {
  const bytes: number[] = [];


  return bytes;
}

// export function serializeExperimentERP(experiment: ExperimentERP): number[] {
//   return [];
// }

