import { IsDefined, IsEnum, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Edge, ErpOutput, ExperimentERP, OutputDependency, OutputType, Random } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@diplomka-backend/stim-lib-common';

import { ExperimentDTO, OutputTypeDTO } from './experiment-dto';
import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';

export class ExperimentErpDTO extends ExperimentDTO implements ExperimentERP {
  @IsInt()
  @Min(1)
  maxDistribution: number;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @Min(1, {
    context: {
      code: 1,
    },
  })
  out: number;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @Min(1, {
    context: {
      code: 1,
    },
  })
  wait: number;

  @IsEnum(Edge)
  edge: Edge;

  @IsEnum(Random)
  random: Random;

  @ValidateNested({
    context: {
      code: 1,
    },
  })
  @IsNonPrimitiveArray({
    context: {
      code: 1,
    },
  })
  @Type(() => ErpOutputDTO)
  outputs: ErpOutput[];
  sequenceId: number | null;
}

export class ErpOutputDTO implements ErpOutput {
  @IsInt({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Min(1, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  id: number;

  @IsInt({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Min(1, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  experimentId: number;

  @IsInt({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Min(1, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Max(8, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  orderId: number;

  @ValidateNested({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Type(() => OutputTypeDTO)
  outputType: OutputType;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @Min(1, {
    context: {
      code: 1,
    },
  })
  pulseUp: number;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @Min(1, {
    context: {
      code: 1,
    },
  })
  pulseDown: number;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @Min(1, {
    context: {
      code: 1,
    },
  })
  @Max(100, {
    context: {
      code: 1,
    },
  })
  distribution: number;

  @IsInt({
    always: true,
    context: {
      code: 1,
    },
  })
  @Min(0, {
    always: true,
    context: {
      code: 1,
    },
  })
  @Max(100, {
    always: true,
    context: {
      code: 1,
    },
  })
  brightness: number;

  @IsDefined({
    context: {
      code: 1,
    },
  })
  dependencies: [OutputDependency[], any];
}
