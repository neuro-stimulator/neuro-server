import { Logger } from '@nestjs/common';

import {
  CvepOutput,
  ErpOutput,
  ErpOutputDependency,
  Experiment,
  ExperimentCVEP,
  ExperimentERP,
  ExperimentFVEP,
  ExperimentREA,
  ExperimentTVEP,
  ExperimentType,
  experimentTypeFromRaw,
  FvepOutput,
  HorizontalAlignment,
  horizontalAlignmentFromRaw,
  Output,
  outputTypeFromRaw,
  outputTypeToRaw,
  ReaOutput,
  TvepOutput,
  UserGroupInfo,
  VerticalAlignment,
  verticalAlignmentFromRaw,
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
import { ExperimentCvepOutputEntity } from '../model/entity/experiment-cvep-output.entity';
import { ExperimentReaOutputEntity } from '../model/entity/experiment-rea-output.entity';
import { GroupEntity } from '@neuro-server/stim-feature-users/domain';

export function entityToExperiment(entity: ExperimentEntity): Experiment<Output> {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    created: entity.created,
    type: experimentTypeFromRaw(ExperimentType[entity.type]),
    usedOutputs: outputTypeFromRaw(entity.usedOutputs),
    outputCount: entity.outputCount,
    tags: JSON.parse(entity.tags) || [],
    supportSequences: entity.supportSequences,
    outputs: [],
    userGroups: entity.userGroups?.reduce(
      (acc: Record<number, UserGroupInfo>, group: GroupEntity) => {
        acc[group.id] = { id: group.id, name: group.name };
        return acc;
      },
      {})
  };
}

export function experimentToEntity(experiment: Experiment<Output>): ExperimentEntity {
  const entity = new ExperimentEntity();
  entity.id = experiment.id;
  entity.name = experiment.name;
  entity.description = experiment.description;
  entity.created = experiment.created;
  entity.type = experiment.type;
  entity.usedOutputs = outputTypeToRaw(experiment.usedOutputs);
  entity.outputCount = experiment.outputCount;
  entity.tags = JSON.stringify(experiment.tags);
  entity.supportSequences = experiment.supportSequences;
  entity.userGroups = Object.values(experiment.userGroups).map((groupInfo: UserGroupInfo) => {
    const groupEntity = new GroupEntity();
    groupEntity.id = groupInfo.id;
    groupEntity.name = groupInfo.name;
    return groupEntity;
  })
  return entity;
}

export function entityToExperimentErp(
  experiment: Experiment<Output>,
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
    defaultSequenceSize: entity.defaultSequenceSize
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
  entity.defaultSequenceSize = experiment.defaultSequenceSize;

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
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    manualAlignment: entity.manualAlignment,
    horizontalAlignment: horizontalAlignmentFromRaw(HorizontalAlignment[entity.horizontalAlignment]),
    verticalAlignment: verticalAlignmentFromRaw(VerticalAlignment[entity.horizontalAlignment]),
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
  entity.x = output.x;
  entity.y = output.y;
  entity.width = output.width;
  entity.height = output.height;
  entity.manualAlignment = output.manualAlignment;
  entity.horizontalAlignment = output.horizontalAlignment;
  entity.verticalAlignment = output.verticalAlignment;
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

export function entityToExperimentCvep(experiment: Experiment<Output>, entity: ExperimentCvepEntity, outputs: ExperimentCvepOutputEntity[]): ExperimentCVEP {
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
    outputs: outputs.map((output: ExperimentCvepOutputEntity) => {
      output.experimentId = experiment.id;
      return entityToExperimentCvepOutput(output);
    }),
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

export function entityToExperimentCvepOutput(entity: ExperimentCvepOutputEntity): CvepOutput {
  const cvepOutput: CvepOutput = {
    id: entity.id,
    experimentId: entity.experimentId,
    orderId: entity.orderId,
    outputType: outputTypeFromRaw(entity.type),
    brightness: entity.brightness,
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    manualAlignment: entity.manualAlignment,
    horizontalAlignment: horizontalAlignmentFromRaw(HorizontalAlignment[entity.horizontalAlignment]),
    verticalAlignment: verticalAlignmentFromRaw(VerticalAlignment[entity.horizontalAlignment]),
  };

  cvepOutput.outputType.audioFile = entity.audioFile;
  cvepOutput.outputType.imageFile = entity.imageFile;
  return cvepOutput;
}

export function experimentCvepOutputToEntity(output: CvepOutput): ExperimentCvepOutputEntity {
  const entity = new ExperimentCvepOutputEntity();

  entity.id = output.id;
  entity.experimentId = output.experimentId;
  entity.orderId = output.orderId;
  entity.type = outputTypeToRaw(output.outputType);
  entity.audioFile = output.outputType.audioFile;
  entity.imageFile = output.outputType.imageFile;
  entity.brightness = output.brightness;
  entity.x = output.x;
  entity.y = output.y;
  entity.width = output.width;
  entity.height = output.height;
  entity.manualAlignment = output.manualAlignment;
  entity.horizontalAlignment = output.horizontalAlignment;
  entity.verticalAlignment = output.verticalAlignment;

  return entity;
}

export function entityToExperimentFvep(experiment: Experiment<Output>, entity: ExperimentFvepEntity, outputs: ExperimentFvepOutputEntity[]): ExperimentFVEP {
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
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    manualAlignment: entity.manualAlignment,
    horizontalAlignment: horizontalAlignmentFromRaw(HorizontalAlignment[entity.horizontalAlignment]),
    verticalAlignment: verticalAlignmentFromRaw(VerticalAlignment[entity.horizontalAlignment]),
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
  entity.x = output.x;
  entity.y = output.y;
  entity.width = output.width;
  entity.height = output.height;
  entity.manualAlignment = output.manualAlignment;
  entity.horizontalAlignment = output.horizontalAlignment;
  entity.verticalAlignment = output.verticalAlignment;

  return entity;
}

export function entityToExperimentTvep(experiment: Experiment<Output>, entity: ExperimentTvepEntity, outputs: ExperimentTvepOutputEntity[]): ExperimentTVEP {
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
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    manualAlignment: entity.manualAlignment,
    horizontalAlignment: horizontalAlignmentFromRaw(HorizontalAlignment[entity.horizontalAlignment]),
    verticalAlignment: verticalAlignmentFromRaw(VerticalAlignment[entity.horizontalAlignment]),
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
  entity.x = output.x;
  entity.y = output.y;
  entity.width = output.width;
  entity.height = output.height;
  entity.manualAlignment = output.manualAlignment;
  entity.horizontalAlignment = output.horizontalAlignment;
  entity.verticalAlignment = output.verticalAlignment;

  return entity;
}

export function entityToExperimentRea(experiment: Experiment<Output>, entity: ExperimentReaEntity, outputs: ExperimentReaOutputEntity[]): ExperimentREA {
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
    outputs: outputs.map((output: ExperimentReaOutputEntity) => {
      output.experimentId = experiment.id;
      return entityToExperimentReaOutput(output);
    }),
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

export function entityToExperimentReaOutput(entity: ExperimentReaOutputEntity): ReaOutput {
  const reaOutput: ReaOutput = {
    id: entity.id,
    experimentId: entity.experimentId,
    orderId: entity.orderId,
    outputType: outputTypeFromRaw(entity.type),
    brightness: entity.brightness,
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    manualAlignment: entity.manualAlignment,
    horizontalAlignment: horizontalAlignmentFromRaw(HorizontalAlignment[entity.horizontalAlignment]),
    verticalAlignment: verticalAlignmentFromRaw(VerticalAlignment[entity.horizontalAlignment]),
  };
  reaOutput.outputType.audioFile = entity.audioFile;
  reaOutput.outputType.imageFile = entity.imageFile;

  return reaOutput;
}

export function experimentReaOutputToEntity(output: ReaOutput): ExperimentReaOutputEntity {
  const entity = new ExperimentReaOutputEntity();

  entity.id = output.id;
  entity.experimentId = output.experimentId;
  entity.orderId = output.orderId;
  entity.type = outputTypeToRaw(output.outputType);
  entity.audioFile = output.outputType.audioFile;
  entity.imageFile = output.outputType.imageFile;
  entity.brightness = output.brightness;
  entity.x = output.x;
  entity.y = output.y;
  entity.width = output.width;
  entity.height = output.height;
  entity.manualAlignment = output.manualAlignment;
  entity.horizontalAlignment = output.horizontalAlignment;
  entity.verticalAlignment = output.verticalAlignment;

  return entity;
}
