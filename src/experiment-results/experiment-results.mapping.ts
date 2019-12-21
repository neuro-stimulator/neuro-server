import { ExperimentResult, ExperimentType } from 'diplomka-share';

import { ExperimentResultEntity } from './experiment-result.entity';

export function entityToExperimentResult(entity: ExperimentResultEntity): ExperimentResult {
  return {
    id: entity.id,
    experimentID: entity.experimentID,
    type: ExperimentType[entity.type],
    name: entity.name,
    date: entity.date,
    filename: entity.filename
  };
}

export function experimentResultToEntity(experiment: ExperimentResult) {
  const entity = new ExperimentResultEntity();

  entity.id = experiment.id;
  entity.experimentID = experiment.experimentID;
  entity.type = ExperimentType[experiment.type];
  entity.name = experiment.name;
  entity.date = experiment.date;
  entity.filename = experiment.filename;

  return entity;
}
