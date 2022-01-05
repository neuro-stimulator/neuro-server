import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclRoleEntity } from '../model/entity/acl-role.entity';

@Injectable()
@Seeder(AclRoleEntity)
export class AclRoleSeeder extends BaseSeederService<AclRoleEntity> {
  protected convertEntities(data: AclRoleEntity[]): AclRoleEntity[] {
    return plainToClass(AclRoleEntity, data);
  }
}
