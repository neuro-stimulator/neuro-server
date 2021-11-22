import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from '@nestjs/class-validator';

import { User } from '@stechy1/diplomka-share';

export class UserDTO implements User {
  // @IsDefined({
  //   groups: [SEQUENCE_FULL_GROUP],
  //   context: {
  //     code: 0,
  //   },
  // })
  id?: number;

  @IsString({
    always: true,
    context: {
      code: 1,
    },
  })
  @MinLength(3, {
    always: true,
    context: {
      code: 1,
    },
  })
  @MaxLength(50, {
    always: true,
    context: {
      code: 1,
    },
  })
  username: string;

  @IsEmail(
    { allow_display_name: true },
    {
      always: true,
      context: {
        code: 1,
      },
    }
  )
  email: string;

  @IsString({
    always: true,
    context: {
      code: 1,
    },
  })
  @MinLength(10, {
    always: true,
    context: {
      code: 1,
    },
  })
  password: string;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @IsOptional()
  lastLoginDate: number;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @IsOptional({
    context: {
      code: 1,
    },
  })
  createdAt?: number;

  @IsInt({
    context: {
      code: 1,
    },
  })
  @IsOptional({
    context: {
      code: 1,
    },
  })
  updatedAt?: number;
}
