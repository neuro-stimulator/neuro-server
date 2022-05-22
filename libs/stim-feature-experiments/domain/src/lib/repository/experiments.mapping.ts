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
  verticalAlignmentFromRaw
} from '@stechy1/diplomka-share';

import { GroupEntity } from '@neuro-server/stim-feature-users/domain';

import { ExperimentCvepOutputEntity } from '../model/entity/experiment-cvep-output.entity';
import { ExperimentCvepEntity } from '../model/entity/experiment-cvep.entity';
import { ExperimentErpOutputDependencyEntity } from '../model/entity/experiment-erp-output-dependency.entity';
import { ExperimentErpOutputEntity } from '../model/entity/experiment-erp-output.entity';
import { ExperimentErpEntity } from '../model/entity/experiment-erp.entity';
import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';
import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';
import { ExperimentOutputEntity } from '../model/entity/experiment-output.entity';
import { ExperimentReaOutputEntity } from '../model/entity/experiment-rea-output.entity';
import { ExperimentReaEntity } from '../model/entity/experiment-rea.entity';
import { ExperimentTvepOutputEntity } from '../model/entity/experiment-tvep-output.entity';
import { ExperimentTvepEntity } from '../model/entity/experiment-tvep.entity';
import { ExperimentEntity } from '../model/entity/experiment.entity';


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
  return {
    ...entityToExperimentOutput(entity),
    experimentId: entity.experimentId,
    pulseUp: entity.pulseUp,
    pulseDown: entity.pulseDown,
    distribution: entity.distribution,
    dependencies: [dependencies.map((value: ExperimentErpOutputDependencyEntity) => entityToExperimentErpOutputDependency(value)), undefined]
  };
}

export function experimentErpOutputToEntity(output: ErpOutput): ExperimentErpOutputEntity {
  const entity = new ExperimentErpOutputEntity();
  experimentOutputToEntity(output, entity);

  entity.experimentId = output.experimentId;
  entity.pulseUp = output.pulseUp;
  entity.pulseDown = output.pulseDown;
  entity.distribution = output.distribution;

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

  return {
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
}

export function experimentCvepToEntity(experiment: ExperimentCVEP): ExperimentCvepEntity {
  const entity = new ExperimentCvepEntity();

  entity.id = experiment.id;
  entity.outputCount = experiment.outputCount;
  entity.out = experiment.out;
  entity.wait = experiment.wait;
  entity.bitShift = experiment.bitShift;
  entity.pattern = experiment.pattern;
  entity.brightness = experiment.brightness;

  return entity;
}

export function entityToExperimentCvepOutput(entity: ExperimentCvepOutputEntity): CvepOutput {
  return {
    ...entityToExperimentOutput(entity),
    experimentId: entity.experimentId,
  };
}

export function experimentCvepOutputToEntity(output: CvepOutput): ExperimentCvepOutputEntity {
  const entity = new ExperimentCvepOutputEntity();
  experimentOutputToEntity(output, entity);

  entity.experimentId = output.experimentId;

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
  return {
    ...entityToExperimentOutput(entity),
    experimentId: entity.experimentId,
    timeOn: entity.timeOn,
    timeOff: entity.timeOff,
    frequency: entity.frequency,
    dutyCycle: entity.dutyCycle
  };
}

export function experimentFvepOutputToEntity(output: FvepOutput): ExperimentFvepOutputEntity {
  const entity = new ExperimentFvepOutputEntity();
  experimentOutputToEntity(output, entity);

  entity.experimentId = output.experimentId;
  entity.timeOn = output.timeOn;
  entity.timeOff = output.timeOff;
  entity.frequency = output.frequency;
  entity.dutyCycle = output.dutyCycle;

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
  return {
    ...entityToExperimentOutput(entity),
    experimentId: entity.experimentId,
    out: entity.out,
    wait: entity.wait,
    patternLength: entity.patternLength,
    pattern: entity.pattern,
  };
}

export function experimentTvepOutputToEntity(output: TvepOutput): ExperimentTvepOutputEntity {
  const entity = new ExperimentTvepOutputEntity();
  experimentOutputToEntity(output, entity);

  entity.experimentId = output.experimentId;
  entity.out = output.out;
  entity.wait = output.wait;
  entity.patternLength = output.patternLength;
  entity.pattern = output.pattern;

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
  return {
    ...entityToExperimentOutput(entity),
    experimentId: entity.experimentId,
  };
}

export function experimentReaOutputToEntity(output: ReaOutput): ExperimentReaOutputEntity {
  const entity = new ExperimentReaOutputEntity();
  experimentOutputToEntity(output, entity);

  entity.experimentId = output.experimentId;

  return entity;
}

function entityToExperimentOutput(entity: ExperimentOutputEntity): Omit<Output, 'experimentId'> {
  const output: Omit<Output, 'experimentId'> = {
    id: entity.id,
    orderId: entity.orderId,
    outputType: outputTypeFromRaw(entity.type),
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    manualAlignment: entity.manualAlignment,
    horizontalAlignment: horizontalAlignmentFromRaw(HorizontalAlignment[entity.horizontalAlignment]),
    verticalAlignment: verticalAlignmentFromRaw(VerticalAlignment[entity.horizontalAlignment]),
    brightness: entity.brightness,
  };
  output.outputType.audioFile = entity.audioFile;
  output.outputType.imageFile = entity.imageFile;
  output.outputType.matrixContent = decodeMatrixContent(entity.matrixContent);

  return output;
}

function experimentOutputToEntity(output: Output, entity: ExperimentOutputEntity): void {
  entity.id = output.id;
  entity.orderId = output.orderId;
  entity.type = outputTypeToRaw(output.outputType);
  entity.audioFile = output.outputType.audioFile;
  entity.imageFile = output.outputType.imageFile;
  entity.matrixContent = encodeMatrixContent(output.outputType.matrixContent);
  entity.brightness = output.brightness;
  entity.x = output.x;
  entity.y = output.y;
  entity.width = output.width;
  entity.height = output.height;
  entity.manualAlignment = output.manualAlignment;
  entity.horizontalAlignment = output.horizontalAlignment;
  entity.verticalAlignment = output.verticalAlignment;
}

function encodeMatrixContent(content?: number[]): string {
  if (!content) {
    return undefined;
  }

  const buff = new Buffer(JSON.stringify(content));
  return buff.toString('base64');
}

function decodeMatrixContent(content?: string): number[] {
  if (!content) {
    return undefined;
  }

  const buff = new Buffer(content, 'base64');
  return JSON.parse(buff.toString('ascii'));
}