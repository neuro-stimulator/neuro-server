import { Type } from '@nestjs/class-transformer';
import { IsBoolean, IsInt, Max, Min, ValidateNested } from '@nestjs/class-validator';

import { ExperimentTVEP, TvepOutput } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@neuro-server/stim-lib-common';

import { ExperimentOutputDto } from './experiment-output.dto';
import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';
import { ExperimentDTO } from './experiment.dto';

export class ExperimentTvepDTO extends ExperimentDTO implements ExperimentTVEP {
  @IsBoolean({
    always: true,
    context: {
      code: 1,
    },
  })
  sharePatternLength: boolean;

  @ValidateNested({
    always: true,
    context: {
      code: 1,
    },
  })
  @Type(() => TvepOutputDTO)
  @IsNonPrimitiveArray({
    always: true,
    context: {
      code: 1,
    },
  })
  outputs: TvepOutput[];
}

export class TvepOutputDTO extends ExperimentOutputDto implements TvepOutput {
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
  @Max(32, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  patternLength: number;

  @IsInt({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  pattern: number;

  @IsInt({
    groups: [EXPERIMENT_FULL_GROUP],
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
    groups: [EXPERIMENT_FULL_GROUP],
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
}
