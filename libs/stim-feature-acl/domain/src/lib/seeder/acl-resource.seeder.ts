import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclResourceEntity } from '../model/entity/acl-resource.entity';

@Injectable()
@Seeder(AclResourceEntity)
export class AclResourceSeeder extends BaseSeederService<AclResourceEntity> {
  protected convertEntities(data: AclResourceEntity[]): DeepPartial<AclResourceEntity>[] {
    return plainToClass(AclResourceEntity, data);
  }
}
