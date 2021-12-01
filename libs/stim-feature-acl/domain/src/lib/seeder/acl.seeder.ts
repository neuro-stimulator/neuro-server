import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclEntity } from '../model/entity/acl.entity';

@Injectable()
@Seeder(AclEntity)
export class AclSeeder extends BaseSeederService<AclEntity> {
  protected convertEntities(data: AclEntity[]): AclEntity[] {
    return plainToClass(AclEntity, data);
  }
}
