import { Type } from '@nestjs/class-transformer';
import { IsInt, Min, ValidateNested } from '@nestjs/class-validator';

import { ExperimentFVEP, FvepOutput } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@neuro-server/stim-lib-common';

import { ExperimentOutputDto } from './experiment-output.dto';
import { ExperimentDTO } from './experiment.dto';

export class ExperimentFvepDTO extends ExperimentDTO implements ExperimentFVEP {
  @ValidateNested({
    context: {
      code: 1,
    },
  })
  @Type(() => FvepOutputDTO)
  @IsNonPrimitiveArray({
    always: true,
    context: {
      code: 1,
    },
  })
  outputs: FvepOutput[];
}

export class FvepOutputDTO extends ExperimentOutputDto implements FvepOutput {
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
  timeOn: number;

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
  timeOff: number;

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
  frequency: number;

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
  dutyCycle: number;
}
