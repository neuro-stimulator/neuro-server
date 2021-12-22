import { IsDefined, IsEnum, IsInt, IsOptional, Max, Min, ValidateNested } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';

import { Edge, ErpOutput, ErpOutputDependency, ExperimentERP, Random } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@neuro-server/stim-lib-common';

import { ExperimentDTO } from './experiment.dto';
import { ExperimentOutputDto } from './experiment-output.dto';
import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';

export class ExperimentErpDTO extends ExperimentDTO implements ExperimentERP {
  @IsInt({
    context: {
      code: 1,
    },
  })
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

  @IsOptional()
  @IsInt({
    context: {
      code: 1
    }
  })
  sequenceId: number | null;

  @IsInt({
    context: {
      code: 1
    }
  })
  @Min(1, {
    context: {
      code: 1,
    },
  })
  defaultSequenceSize: number;
}

export class ErpOutputDTO extends ExperimentOutputDto implements ErpOutput {
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

  @IsDefined({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 0,
    },
  })
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

  @IsDefined({
    context: {
      code: 1,
    },
  })
  dependencies: [ErpOutputDependency[], any];
}
