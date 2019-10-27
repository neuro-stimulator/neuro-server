import { ExperimentEntity } from './experiment.entity';
import { Experiment, ExperimentType } from 'diplomka-share';

export function entityToExperiment(entity: ExperimentEntity): Experiment {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    created: entity.created,
    type: ExperimentType[entity.type],
    output: {
      led: entity.led,
      sound: entity.sound,
      image: entity.image,
    },
  };
}

export function experimentToEntity(experiment: Experiment): ExperimentEntity {
  const entity = new ExperimentEntity();
  entity.id = experiment.id;
  entity.name = experiment.name;
  entity.description = experiment.description;
  entity.created = experiment.created;
  entity.type = ExperimentType[experiment.type];
  entity.led = experiment.output.led || false;
  entity.sound = experiment.output.sound || false;
  entity.image = experiment.output.image || false;
  return entity;
}
