import { IsInt, Max, Min, ValidateNested } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';

import { CvepOutput, ExperimentCVEP } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@neuro-server/stim-lib-common';

import { ExperimentDTO } from './experiment.dto';
import { ExperimentOutputDto } from './experiment-output.dto';

export class ExperimentCvepDTO extends ExperimentDTO implements ExperimentCVEP {
  @IsInt({
    always: true,
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
    always: true,
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
    always: true,
    context: {
      code: 1,
    },
  })
  pattern: number;

  @IsInt({
    always: true,
    context: {
      code: 1,
    },
  })
  @Min(0, {
    context: {
      code: 1,
    },
  })
  @Max(31, {
    context: {
      code: 1,
    },
  })
  bitShift: number;

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
  @Type(() => CvepOutputDto)
  @IsNonPrimitiveArray({
    always: true,
    context: {
      code: 1,
    },
  })
  outputs: CvepOutput[];
}

export class CvepOutputDto extends ExperimentOutputDto implements CvepOutput {}
