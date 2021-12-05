import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclPossessionEntity } from '../model/entity/acl-possession.entity';

@Injectable()
@Seeder(AclPossessionEntity)
export class AclPossessionSeeder extends BaseSeederService<AclPossessionEntity> {
  protected convertEntities(data: AclPossessionEntity[]): AclPossessionEntity[] {
    return plainToClass(AclPossessionEntity, data);
  }
}