import {
  createEmptyExperiment,
  createEmptyExperimentCVEP,
  createEmptyExperimentERP, createEmptyExperimentFVEP, createEmptyExperimentREA,
  createEmptyExperimentTVEP,
  Experiment,
  ExperimentType,
} from '@stechy1/diplomka-share';

export function createEmptyExperimentByType(type: ExperimentType): Experiment {
  switch (type) {
    case ExperimentType.ERP:
      return createEmptyExperimentERP();
    case ExperimentType.CVEP:
      return createEmptyExperimentCVEP();
    case ExperimentType.TVEP:
      return createEmptyExperimentTVEP();
    case ExperimentType.FVEP:
      return createEmptyExperimentFVEP();
    case ExperimentType.REA:
      return createEmptyExperimentREA();
    default:
      return createEmptyExperiment();
  }
}

export function createAllTypesExperiments(): Experiment[] {
  return Object.keys(ExperimentType)
        .filter(type => type !== 'NONE')
        .map((type: string, index: number) => {
          const experiment: Experiment = createEmptyExperimentByType(ExperimentType[type]);
          experiment.id = index;
          experiment.name = `${type}-${index}`;
          return experiment;
        });
}
