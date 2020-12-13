import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { UserEntity } from '../model/entity/user.entity';

@Injectable()
@Seeder(UserEntity)
export class UserSeeder extends BaseSeederService<UserEntity> {
  protected convertEntities(data: UserEntity[]): UserEntity[] {
    return plainToClass(UserEntity, data);
  }
}
