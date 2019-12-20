import { ExperimentResult } from 'diplomka-share';

import { ExperimentResultEntity } from './experiment-result.entity';

export function entityToExperimentResult(entity: ExperimentResultEntity): ExperimentResult {
  return {
    id: entity.id,
    experimentID: entity.experimentID,
    name: entity.name,
    date: entity.date,
    filename: entity.filename
  };
}

export function experimentResultToEntity(experiment: ExperimentResult) {
  const entity = new ExperimentResultEntity();

  entity.id = experiment.id;
  entity.experimentID = experiment.experimentID;
  entity.name = experiment.name;
  entity.date = experiment.date;
  entity.filename = experiment.filename;

  return entity;
}
