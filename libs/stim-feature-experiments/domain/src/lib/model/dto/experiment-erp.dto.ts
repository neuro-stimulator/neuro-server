import { IsDefined, IsEnum, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Edge, ErpOutput, ErpOutputDependency, ExperimentERP, Random } from '@stechy1/diplomka-share';

import { DTO, IsNonPrimitiveArray } from '@diplomka-backend/stim-lib-common';

import { ExperimentDTO } from './experiment-dto';
import { ExperimentOutputDto } from './experiment-output.dto';

export class ExperimentErpDTO extends ExperimentDTO implements DTO, ExperimentERP {
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
  sequenceId: number | null;
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
