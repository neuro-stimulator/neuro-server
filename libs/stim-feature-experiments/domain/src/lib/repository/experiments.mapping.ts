import { Logger } from '@nestjs/common';

import {
  ErpOutput,
  Experiment,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP,
  ExperimentType,
  FvepOutput,
  ErpOutputDependency,
  outputTypeFromRaw,
  outputTypeToRaw,
  TvepOutput,
} from '@stechy1/diplomka-share';

import { ExperimentEntity } from '../model/entity/experiment.entity';
import { ExperimentErpEntity } from '../model/entity/experiment-erp.entity';
import { ExperimentErpOutputEntity } from '../model/entity/experiment-erp-output.entity';
import { ExperimentErpOutputDependencyEntity } from '../model/entity/experiment-erp-output-dependency.entity';
import { ExperimentCvepEntity } from '../model/entity/experiment-cvep.entity';
import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';
import { ExperimentTvepEntity } from '../model/entity/experiment-tvep.entity';
import { ExperimentTvepOutputEntity } from '../model/entity/experiment-tvep-output.entity';
import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';
import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';

export function entityToExperiment(entity: ExperimentEntity): Experiment {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    created: entity.created,
    type: ExperimentType[entity.type],
    usedOutputs: outputTypeFromRaw(entity.usedOutputs),
    outputCount: entity.outputCount,
    tags: JSON.parse(entity.tags) || [],
    supportSequences: entity.supportSequences,
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
  entity.outputCount = experiment.outputCount;
  entity.tags = JSON.stringify(experiment.tags);
  entity.supportSequences = experiment.supportSequences;
  return entity;
}

export function entityToExperimentErp(
  experiment: Experiment,
  entity: ExperimentErpEntity,
  outputs: ExperimentErpOutputEntity[],
  dependencies: ExperimentErpOutputDependencyEntity[]
): ExperimentERP {
  if (experiment.id !== entity.id) {
    Logger.error('Není možné propojit dva experimenty s různým ID!!!');
    throw Error('Byla detekována nekonzistence mezi ID experimentu.');
  }

  return {
    ...experiment,
    maxDistribution: entity.maxDistribution,
    out: entity.out,
    wait: entity.wait,
    edge: entity.edge,
    random: entity.random,
    outputs: outputs.map((output: ExperimentErpOutputEntity) => {
      output.experimentId = experiment.id;
      return entityToExperimentErpOutput(
        output,
        dependencies.filter((value: ExperimentErpOutputDependencyEntity) => value.sourceOutput - 1 === output.orderId)
      );
    }),
    sequenceId: entity.sequenceId,
  };
}

export function experimentErpToEntity(experiment: ExperimentERP): ExperimentErpEntity {
  const entity = new ExperimentErpEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  entity.maxDistribution = experiment.maxDistribution;
  entity.out = experiment.out;
  entity.wait = experiment.wait;
  entity.edge = experiment.edge;
  entity.random = experiment.random;
  entity.sequenceId = experiment.sequenceId;

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
    dependencies: [dependencies.map((value: ExperimentErpOutputDependencyEntity) => entityToExperimentErpOutputDependency(value)), null],
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

export function entityToExperimentErpOutputDependency(entity: ExperimentErpOutputDependencyEntity): ErpOutputDependency {
  return {
    id: entity.id,
    experimentId: entity.experimentId,
    sourceOutput: entity.sourceOutput - 1,
    destOutput: entity.destOutput - 1,
    count: entity.count,
  };
}

export function experimentErpOutputDependencyToEntity(dependency: ErpOutputDependency): ExperimentErpOutputDependencyEntity {
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
    ...experiment,
    out: entity.out,
    wait: entity.wait,
    bitShift: entity.bitShift,
    pattern: entity.pattern,
    brightness: entity.brightness,
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
    ...experiment,
    outputs: outputs.map((output: ExperimentFvepOutputEntity) => {
      output.experimentId = experiment.id;
      return entityToExperimentFvepOutput(output);
    }),
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
    brightness: entity.brightness,
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
    ...experiment,
    sharePatternLength: entity.sharePatternLength,
    outputs: outputs.map((output: ExperimentTvepOutputEntity) => {
      output.experimentId = experiment.id;
      return entityToExperimentTvepOutput(output);
    }),
  };
}

export function experimentTvepToEntity(experiment: ExperimentTVEP): ExperimentTvepEntity {
  const entity = new ExperimentTvepEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  entity.sharePatternLength = experiment.sharePatternLength;

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

export function entityToExperimentRea(experiment: Experiment, entity: ExperimentReaEntity): ExperimentREA {
  if (experiment.id !== entity.id) {
    Logger.error('Není možné propojit dva experimenty s různým ID!!!');
    throw Error('Byla detekována nekonzistence mezi ID experimentu.');
  }

  const experimentRea: ExperimentREA = {
    ...experiment,
    cycleCount: entity.cycleCount,
    waitTimeMin: entity.waitTimeMin,
    waitTimeMax: entity.waitTimeMax,
    missTime: entity.missTime,
    onFail: entity.onFail,
    brightness: entity.brightness,
  };

  experimentRea.usedOutputs.audioFile = entity.audioFile;
  experimentRea.usedOutputs.imageFile = entity.imageFile;

  return experimentRea;
}

export function experimentReaToEntity(experiment: ExperimentREA): ExperimentReaEntity {
  const entity = new ExperimentReaEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  entity.audioFile = experiment.usedOutputs.audioFile;
  entity.imageFile = experiment.usedOutputs.imageFile;
  entity.cycleCount = experiment.cycleCount;
  entity.waitTimeMin = experiment.waitTimeMin;
  entity.waitTimeMax = experiment.waitTimeMax;
  entity.missTime = experiment.missTime;
  entity.onFail = experiment.onFail;
  entity.brightness = experiment.brightness;

  return entity;
}
