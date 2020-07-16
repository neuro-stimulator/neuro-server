import { IsBooleanString, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ExperimentTVEP, OutputType, TvepOutput } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@diplomka-backend/stim-lib-common';

import { ExperimentDTO, OutputTypeDTO } from './experiment-dto';
import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';

export class ExperimentTvepDTO extends ExperimentDTO implements ExperimentTVEP {
  @IsBooleanString({
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

export class TvepOutputDTO implements TvepOutput {
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

  @IsInt({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Min(0, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Max(100, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  brightness: number;
}
