import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { UserEntity } from '../model/entity/user.entity';

@Injectable()
@Seeder(UserEntity)
export class UserSeeder extends BaseSeederService<UserEntity> {
  protected convertEntities(data: UserEntity[]): UserEntity[] {
    return plainToClass(UserEntity, data);
  }
}
