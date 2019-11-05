import { ExperimentEntity } from './experiment.entity';
import { Experiment, ExperimentERP, ExperimentType, ErpOutput } from 'diplomka-share';
import { ExperimentErpEntity } from './type/experiment-erp.entity';
import { Logger } from '@nestjs/common';
import { ExperimentErpOutputEntity } from './type/experiment-erp-output.entity';

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

export function entityToExperimentErp(experiment: Experiment, entity: ExperimentErpEntity, outputs: ExperimentErpOutputEntity[]): ExperimentERP {
  if (experiment.id !== entity.id) {
    Logger.error('Není možné propojit dva experimenty s různým ID!!!');
    throw Error('Byla detekována nekonzistence mezi ID experimentu.');
  }

  return {
    id: experiment.id,
    name: experiment.name,
    description: experiment.description,
    type: experiment.type,
    created: experiment.created,
    output: experiment.output,
    outputCount: entity.outputCount,
    maxDistributionValue: entity.maxDistributionValue,
    out: entity.out,
    wait: entity.wait,
    edge: entity.edge,
    random: entity.random,
    outputs: outputs.map(output => {
      output.experimentId = experiment.id;
      return entityToExperimentErpOutput(output);
    }),
  };
}

export function experimentErpToEntity(experiment: ExperimentERP): ExperimentErpEntity {
  const entity = new ExperimentErpEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  entity.maxDistributionValue = experiment.maxDistributionValue;
  entity.out = experiment.out;
  entity.wait = experiment.wait;
  entity.edge = experiment.edge;
  entity.random = experiment.random;

  return entity;
}

export function entityToExperimentErpOutput(entity: ExperimentErpOutputEntity): ErpOutput {
  return {
    id: entity.id,
    experimentId: entity.experimentId,
    orderId: entity.orderId,
    pulseUp: entity.pulseUp,
    pulseDown: entity.pulseDown,
    distributionValue: entity.distributionValue,
    distributionDelay: entity.distributionDelay,
    brightness: entity.brightness,
  };
}

export function experimentErpOutputToEntity(output: ErpOutput): ExperimentErpOutputEntity {
  const entity = new ExperimentErpOutputEntity();
  entity.id = output.id;
  entity.experimentId = output.experimentId;
  entity.orderId = output.orderId;
  entity.pulseUp = output.pulseUp;
  entity.pulseDown = output.pulseDown;
  entity.distributionValue = output.distributionValue;
  entity.distributionDelay = output.distributionDelay;
  entity.brightness = output.brightness;
  return entity;
}
