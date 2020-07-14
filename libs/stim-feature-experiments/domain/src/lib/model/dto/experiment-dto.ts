import { IsArray, IsDefined, IsInt, IsNotEmpty, Max, MaxLength, Min, MinLength } from 'class-validator';

import { Experiment, ExperimentType, OutputType } from '@stechy1/diplomka-share';

import { EXPERIMENT_INSERT_GROUP, EXPERIMENT_UPDATE_GROUP } from './experiment-validation-groups';

export class ExperimentDTO implements Partial<Experiment> {
  @IsDefined({
    groups: [EXPERIMENT_UPDATE_GROUP],
    context: {
      code: 0,
    },
  })
  id: number;

  @MinLength(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  @MaxLength(50, {
    always: true,
    context: {
      code: 2,
    },
  })
  name: string;

  @IsDefined({
    always: true,
    context: {
      code: 3,
    },
  })
  description: string;

  @IsNotEmpty({
    groups: [EXPERIMENT_UPDATE_GROUP],
    // always: true,
    context: {
      code: 4,
    },
  })
  type: ExperimentType;

  @IsDefined({
    always: true,
    context: {
      code: 5,
    },
  })
  created: number;

  @IsDefined({
    always: true,
    context: {
      code: 6,
    },
  })
  usedOutputs: OutputType;

  @IsInt({
    always: true,
    context: {
      code: 7,
    },
  })
  @Min(1, {
    always: true,
    context: {
      code: 8,
    },
  })
  @Max(8, {
    always: true,
    context: {
      code: 9,
    },
  })
  outputCount: number;

  @IsArray({
    always: true,
    context: {
      code: 10,
    },
  })
  tags: string[];
}
