import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclActionEntity } from '../model/entity/acl-action.entity';

@Injectable()
@Seeder(AclActionEntity)
export class AclActionSeeder extends BaseSeederService<AclActionEntity> {
  protected convertEntities(data: AclActionEntity[]): AclActionEntity[] {
    return plainToClass(AclActionEntity, data);
  }
}
