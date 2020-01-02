import { Logger } from '@nestjs/common';

import { ExperimentType, OutputType, Experiment,
  ExperimentERP, ExperimentCVEP, ExperimentFVEP, ExperimentTVEP,
  ErpOutput, OutputDependency, TvepOutput, FvepOutput,
  outputTypeFromRaw, outputTypeToRaw} from 'diplomka-share';

import { ExperimentEntity } from './experiment.entity';
import { ExperimentErpEntity } from './type/experiment-erp.entity';
import { ExperimentErpOutputEntity } from './type/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from './type/experiment-erp-output-dependency.entity';
import { ExperimentCvepEntity } from './type/experiment-cvep.entity';
import { ExperimentFvepEntity } from './type/experiment-fvep.entity';
import { ExperimentTvepEntity } from './type/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from './type/experiment-tvep-output.entity';
import { ExperimentFvepOutputEntity } from './type/experiment-fvep-output.entity';

export function entityToExperiment(entity: ExperimentEntity): Experiment {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    created: entity.created,
    type: ExperimentType[entity.type],
    usedOutputs: outputTypeFromRaw(entity.usedOutputs),
    outputCount: 0
  };
}

export function experimentToEntity(experiment: Experiment): ExperimentEntity {
  const entity = new ExperimentEntity();
  entity.id = experiment.id;
  entity.name = experiment.name;
  entity.description = experiment.description;
  entity.created = experiment.created;
  entity.type = ExperimentType[experiment.type];
  entity.usedOutputs = outputTypeToRaw(experiment.usedOutputs);
  return entity;
}

export function entityToExperimentErp(
  experiment: Experiment,
  entity: ExperimentErpEntity,
  outputs: ExperimentErpOutputEntity[],
  dependencies: ExperimentErpOutputDependencyEntity[]): ExperimentERP {
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
    usedOutputs: experiment.usedOutputs,
    outputCount: entity.outputCount,
    // maxDistributionValue: entity.maxDistributionValue,
    out: entity.out,
    wait: entity.wait,
    edge: entity.edge,
    random: entity.random,
    outputs: outputs.map(output => {
      output.experimentId = experiment.id;
      return entityToExperimentErpOutput(output, dependencies.filter(value => (value.sourceOutput - 1) === output.orderId));
    }),
  };
}

export function experimentErpToEntity(experiment: ExperimentERP): ExperimentErpEntity {
  const entity = new ExperimentErpEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  // entity.maxDistributionValue = experiment.maxDistributionValue;
  entity.out = experiment.out;
  entity.wait = experiment.wait;
  entity.edge = experiment.edge;
  entity.random = experiment.random;

  return entity;
}

export function entityToExperimentErpOutput(entity: ExperimentErpOutputEntity, dependencies: ExperimentErpOutputDependencyEntity[]): ErpOutput {
  const erpOutput: ErpOutput = {
    id: entity.id,
    experimentId: entity.experimentId,
    orderId: entity.orderId,
    outputType: outputTypeFromRaw(entity.type),
    pulseUp: entity.pulseUp,
    pulseDown: entity.pulseDown,
    distribution: entity.distribution,
    brightness: entity.brightness,
    dependencies: [dependencies.map(value => entityToExperimentErpOutputDependency(value)), null],
  };
  erpOutput.outputType.audioFile = entity.audioFile;
  erpOutput.outputType.imageFile = entity.imageFile;

  return erpOutput;
}

export function experimentErpOutputToEntity(output: ErpOutput): ExperimentErpOutputEntity {
  const entity = new ExperimentErpOutputEntity();
  entity.id = output.id;
  entity.experimentId = output.experimentId;
  entity.orderId = output.orderId;
  entity.type = outputTypeToRaw(output.outputType);
  entity.audioFile = output.outputType.audioFile;
  entity.imageFile = output.outputType.imageFile;
  entity.pulseUp = output.pulseUp;
  entity.pulseDown = output.pulseDown;
  entity.distribution = output.distribution;
  entity.brightness = output.brightness;

  return entity;
}

export function entityToExperimentErpOutputDependency(entity: ExperimentErpOutputDependencyEntity): OutputDependency {
  return {
    id: entity.id,
    experimentId: entity.experimentId,
    sourceOutput: entity.sourceOutput - 1,
    destOutput: entity.destOutput - 1,
    count: entity.count,
  };
}

export function experimentErpOutputDependencyToEntity(dependency: OutputDependency): ExperimentErpOutputDependencyEntity {
  const entity = new ExperimentErpOutputDependencyEntity();

  entity.id = dependency.id;
  entity.experimentId = dependency.experimentId;
  entity.sourceOutput = dependency.sourceOutput + 1;
  entity.destOutput = dependency.destOutput + 1;
  entity.count = dependency.count;

  return entity;
}

export function entityToExperimentCvep(experiment: Experiment, entity: ExperimentCvepEntity): ExperimentCVEP {
  if (experiment.id !== entity.id) {
    Logger.error('Není možné propojit dva experimenty s různým ID!!!');
    throw Error('Byla detekována nekonzistence mezi ID experimentu.');
  }

  const experimentCvep: ExperimentCVEP = {
    id: experiment.id,
    name: experiment.name,
    description: experiment.description,
    type: experiment.type,
    created: experiment.created,
    usedOutputs: experiment.usedOutputs,
    outputCount: entity.outputCount,
    out: entity.out,
    wait: entity.wait,
    bitShift: entity.bitShift,
    pattern: entity.pattern,
    brightness: entity.brightness
  };

  experimentCvep.usedOutputs.audioFile = entity.audioFile;
  experimentCvep.usedOutputs.imageFile = entity.imageFile;

  return experimentCvep;
}

export function experimentCvepToEntity(experiment: ExperimentCVEP): ExperimentCvepEntity {
  const entity = new ExperimentCvepEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  entity.audioFile = experiment.usedOutputs.audioFile;
  entity.imageFile = experiment.usedOutputs.imageFile;
  entity.out = experiment.out;
  entity.wait = experiment.wait;
  entity.bitShift = experiment.bitShift;
  entity.pattern = experiment.pattern;
  entity.brightness = experiment.brightness;

  return entity;
}

export function entityToExperimentFvep(experiment: Experiment, entity: ExperimentFvepEntity, outputs: ExperimentFvepOutputEntity[]): ExperimentFVEP {
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
    usedOutputs: experiment.usedOutputs,
    outputCount: entity.outputCount,
    outputs: outputs.map(output => {
      output.experimentId = experiment.id;
      return entityToExperimentFvepOutput(output);
    })
  };
}

export function experimentFvepToEntity(experiment: ExperimentFVEP): ExperimentFvepEntity {
  const entity = new ExperimentFvepEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;

  return entity;
}

export function entityToExperimentFvepOutput(entity: ExperimentFvepOutputEntity): FvepOutput {
  const fvepOutput: FvepOutput = {
    id: entity.id,
    experimentId: entity.experimentId,
    orderId: entity.orderId,
    outputType: outputTypeFromRaw(entity.type),
    timeOn: entity.timeOn,
    timeOff: entity.timeOff,
    frequency: entity.frequency,
    dutyCycle: entity.dutyCycle,
    brightness: entity.brightness
  };
  fvepOutput.outputType.audioFile = entity.audioFile;
  fvepOutput.outputType.imageFile = entity.imageFile;

  return fvepOutput;
}

export function experimentFvepOutputToEntity(output: FvepOutput): ExperimentFvepOutputEntity {
  const entity = new ExperimentFvepOutputEntity();

  entity.id = output.id;
  entity.experimentId = output.experimentId;
  entity.orderId = output.orderId;
  entity.type = outputTypeToRaw(output.outputType);
  entity.audioFile = output.outputType.audioFile;
  entity.imageFile = output.outputType.imageFile;
  entity.timeOn = output.timeOn;
  entity.timeOff = output.timeOff;
  entity.frequency = output.frequency;
  entity.dutyCycle = output.dutyCycle;
  entity.brightness = output.brightness;

  return entity;
}

export function entityToExperimentTvep(experiment: Experiment, entity: ExperimentTvepEntity, outputs: ExperimentTvepOutputEntity[]): ExperimentTVEP {
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
    usedOutputs: experiment.usedOutputs,
    outputCount: entity.outputCount,
    outputs: outputs.map(output => {
      output.experimentId = experiment.id;
      return entityToExperimentTvepOutput(output);
    })
  };
}

export function experimentTvepToEntity(experiment: ExperimentTVEP): ExperimentTvepEntity {
  const entity = new ExperimentTvepEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;

  return entity;
}

export function entityToExperimentTvepOutput(entity: ExperimentTvepOutputEntity): TvepOutput {
  const tvepOutput: TvepOutput = {
    id: entity.id,
    experimentId: entity.experimentId,
    orderId: entity.orderId,
    outputType: outputTypeFromRaw(entity.type),
    out: entity.out,
    wait: entity.wait,
    patternLength: entity.patternLength,
    pattern: entity.pattern,
    brightness: entity.brightness,
  };
  tvepOutput.outputType.audioFile = entity.audioFile;
  tvepOutput.outputType.imageFile = entity.imageFile;

  return tvepOutput;
}

export function experimentTvepOutputToEntity(output: TvepOutput): ExperimentTvepOutputEntity {
  const entity = new ExperimentTvepOutputEntity();

  entity.id = output.id;
  entity.experimentId = output.experimentId;
  entity.orderId = output.orderId;
  entity.type = outputTypeToRaw(output.outputType);
  entity.audioFile = output.outputType.audioFile;
  entity.imageFile = output.outputType.imageFile;
  entity.out = output.out;
  entity.wait = output.wait;
  entity.patternLength = output.patternLength;
  entity.pattern = output.pattern;
  entity.brightness = output.brightness;

  return entity;
}
