import { Allow, IsDefined, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';

import { ExperimentResult, ExperimentType } from '@stechy1/diplomka-share';

import { DTO } from '@neuro-server/stim-lib-common';
import { EXPERIMENT_FULL_GROUP } from '@neuro-server/stim-feature-experiments/domain';

import { EXPERIMENT_RESULT_FULL_GROUP } from './experiment-result-validator-groups';

export class ExperimentResultDTO implements DTO, ExperimentResult {
  @IsDefined({
    groups: [EXPERIMENT_RESULT_FULL_GROUP],
    context: {
      code: 0,
    },
  })
  id?: number;

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
  experimentID: number;

  @IsEnum(ExperimentType)
  type: ExperimentType;

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

  @Allow()
  name: null | string;

  @IsInt({
    always: true,
    context: {
      code: 7,
    },
  })
  date: number;

  @IsString({
    always: true,
    context: {
      code: 1,
    },
  })
  filename: string;
}
