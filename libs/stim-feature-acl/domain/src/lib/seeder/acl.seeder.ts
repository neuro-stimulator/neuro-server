import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclEntity } from '../model/entity/acl.entity';

@Injectable()
@Seeder(AclEntity)
export class AclSeeder extends BaseSeederService<AclEntity> {
  protected convertEntities(data: AclEntity[]): DeepPartial<AclEntity>[] {
    return plainToClass(AclEntity, data);
  }
}
