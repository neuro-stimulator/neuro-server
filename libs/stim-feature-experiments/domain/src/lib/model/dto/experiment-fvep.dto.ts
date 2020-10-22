import { IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ExperimentFVEP, FvepOutput } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@diplomka-backend/stim-lib-common';

import { ExperimentDTO } from './experiment-dto';
import { ExperimentOutputDto } from './experiment-output.dto';

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
