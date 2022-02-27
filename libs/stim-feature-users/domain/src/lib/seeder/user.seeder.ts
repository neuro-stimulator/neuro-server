import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { UserEntity } from '../model/entity/user.entity';

@Injectable()
@Seeder(UserEntity)
export class UserSeeder extends BaseSeederService<UserEntity> {
  protected convertEntities(data: UserEntity[]): DeepPartial<UserEntity>[] {
    return plainToClass(UserEntity, data);
  }
}
