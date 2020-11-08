import { IsBooleanString, IsEnum, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { HorizontalAlignment, Output, OutputType, VerticalAlignment } from '@stechy1/diplomka-share';

import { EXPERIMENT_FULL_GROUP } from './experiment-validation-groups';
import { OutputTypeDTO } from './experiment-dto';

export class ExperimentOutputDto implements Output {
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
  @Min(0, {
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

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsInt({
    context: {
      code: 1,
    },
  })
  x: number;

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsInt({
    context: {
      code: 1,
    },
  })
  y: number;

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsInt({
    context: {
      code: 1,
    },
  })
  height: number;

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsInt({
    context: {
      code: 1,
    },
  })
  width: number;

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsBooleanString({
    context: {
      code: 1,
    },
  })
  manualAlignment: boolean;

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsEnum(HorizontalAlignment)
  horizontalAlignment: HorizontalAlignment;

  @IsOptional({
    context: {
      code: 1,
    },
  })
  @IsEnum(VerticalAlignment)
  verticalAlignment: VerticalAlignment;
}
