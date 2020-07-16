import { IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { ExperimentFVEP, FvepOutput, OutputType } from '@stechy1/diplomka-share';

import { IsNonPrimitiveArray } from '@diplomka-backend/stim-lib-common';

import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';
import { ExperimentDTO, OutputTypeDTO } from './experiment-dto';

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

export class FvepOutputDTO implements FvepOutput {
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
