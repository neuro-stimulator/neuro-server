import { IsEnum, IsInt, Max, Min } from 'class-validator';

import { ExperimentREA, ReaOnResponseFail } from '@stechy1/diplomka-share';

import { ExperimentDTO } from './experiment-dto';

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
}
