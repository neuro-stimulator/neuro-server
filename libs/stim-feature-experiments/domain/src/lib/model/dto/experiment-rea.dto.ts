import { Type } from '@nestjs/class-transformer';
import { IsEnum, IsInt, Max, Min, ValidateNested } from '@nestjs/class-validator';

import { ExperimentREA, ReaOnResponseFail, ReaOutput, TvepOutput } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@neuro-server/stim-lib-common';

import { ExperimentOutputDto } from './experiment-output.dto';
import { ExperimentDTO } from './experiment.dto';

export class ExperimentReaDTO extends ExperimentDTO implements ExperimentREA {
  @Min(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  cycleCount: number;

  @Min(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  waitTimeMin: number;

  @Min(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  waitTimeMax: number;

  @Min(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  missTime: number;

  @IsEnum(ReaOnResponseFail)
  onFail: ReaOnResponseFail;

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

  @ValidateNested({
    always: true,
    context: {
      code: 1,
    },
  })
  @Type(() => ReaOutputDto)
  @IsNonPrimitiveArray({
    always: true,
    context: {
      code: 1,
    },
  })
  outputs: TvepOutput[];
}

export class ReaOutputDto extends ExperimentOutputDto implements ReaOutput {}
