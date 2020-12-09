import { IsBoolean, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ExperimentTVEP, TvepOutput } from '@stechy1/diplomka-share';

import { DTO, IsNonPrimitiveArray } from '@diplomka-backend/stim-lib-common';

import { ExperimentDTO } from './experiment-dto';
import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';
import { ExperimentOutputDto } from './experiment-output.dto';

export class ExperimentTvepDTO extends ExperimentDTO implements DTO, ExperimentTVEP {
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
