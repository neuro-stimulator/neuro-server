import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { AclActionEntity } from '../model/entity/acl-action.entity';

@Injectable()
@Seeder(AclActionEntity)
export class AclActionSeeder extends BaseSeederService<AclActionEntity> {
  protected convertEntities(data: AclActionEntity[]): DeepPartial<AclActionEntity>[] {
    return plainToClass(AclActionEntity, data);
  }
}
