import { IsInt, Max, Min } from 'class-validator';

import { ExperimentCVEP } from '@stechy1/diplomka-share';

import { ExperimentDTO } from './experiment-dto';

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
}
