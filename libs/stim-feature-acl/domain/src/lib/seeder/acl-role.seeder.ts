import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclRoleEntity } from '../model/entity/acl-role.entity';

@Injectable()
@Seeder(AclRoleEntity)
export class AclRoleSeeder extends BaseSeederService<AclRoleEntity> {
  protected convertEntities(data: AclRoleEntity[]): DeepPartial<AclRoleEntity>[] {
    return plainToClass(AclRoleEntity, data);
  }
}
