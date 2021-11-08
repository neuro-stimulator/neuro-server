import { ArrayMinSize, IsArray, IsDefined, IsInt, Min, MinLength } from 'class-validator';

import { Sequence } from '@stechy1/diplomka-share';

import { DTO } from '@neuro-server/stim-lib-common';
import { EXPERIMENT_FULL_GROUP } from '@neuro-server/stim-feature-experiments/domain';

import { SEQUENCE_FULL_GROUP } from './sequence-validator-groups';

export class SequenceDTO implements DTO, Sequence {
  @IsDefined({
    groups: [SEQUENCE_FULL_GROUP],
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
  experimentId: number;

  @MinLength(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  name: string;

  @IsInt({
    always: true,
    context: {
      code: 1,
    },
  })
  created: number;

  @IsArray({
    always: true,
    context: {
      code: 1,
    },
  })
  @ArrayMinSize(1, {
    always: true,
    context: {
      code: 1,
    },
  })
  data: number[];

  @IsInt({
    always: true,
    context: {
      code: 1,
    },
  })
  @Min(1, {
    always: true,
    context: {
      code: 8,
    },
  })
  size: number;

  @IsArray({
    always: true,
    context: {
      code: 1,
    },
  })
  tags: string[];
}
