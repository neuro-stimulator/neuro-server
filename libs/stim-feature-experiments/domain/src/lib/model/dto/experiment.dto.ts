import { Type } from '@nestjs/class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from '@nestjs/class-validator';

import { Experiment, ExperimentType, Output, OutputType, UserGroups } from '@stechy1/diplomka-share';

import { DTO } from '@neuro-server/stim-lib-dto';

import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';

export class ExperimentDTO implements DTO<ExperimentType>, Experiment<Output> {
  @IsDefined({
    groups: [EXPERIMENT_FULL_GROUP],
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

  @IsEnum(ExperimentType)
  type: ExperimentType;

  @IsInt({
    always: true,
    context: {
      code: 5,
    },
  })
  created: number;

  @ValidateNested({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  @Type(() => OutputTypeDTO)
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

  @IsBoolean({
    always: true,
    context: {
      code: 11,
    },
  })
  supportSequences: boolean;

  @IsDefined({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 12,
    },
  })
  outputs: Output[];

  @IsDefined({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 13,
    },
  })
  userGroups: UserGroups;

}

export class OutputTypeDTO implements OutputType {
  @IsBoolean({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  led?: boolean;

  @IsBoolean({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  image?: boolean;

  // @ValidateIf((output: OutputType) => output.image === true)
  // @IsDefined({
  //   groups: [EXPERIMENT_FULL_GROUP],
  //   context: {
  //     code: 1,
  //   },
  // })
  @IsOptional()
  imageFile?: string;

  @IsBoolean({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  audio?: boolean;

  // @ValidateIf((output: OutputType) => output.audio === true)
  // @IsDefined({
  //   groups: [EXPERIMENT_FULL_GROUP],
  //   context: {
  //     code: 1,
  //   },
  // })
  @IsOptional()
  audioFile?: string;

  @IsBoolean({
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    },
  })
  matrix?: boolean;

  @IsOptional()
  @IsNumber(
    {},
    {
      each: true,
      groups: [EXPERIMENT_FULL_GROUP],
      context: {
        code: 1,
      }
    })
  @ArrayMaxSize(64, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    }
  })
  @ArrayMinSize(64, {
    groups: [EXPERIMENT_FULL_GROUP],
    context: {
      code: 1,
    }
  })
  matrixContent?: number[];
}
