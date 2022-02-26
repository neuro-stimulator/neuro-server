import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { GroupEntity } from '../model/entity/group.entity';

@Injectable()
@Seeder(GroupEntity)
export class GroupSeeder extends BaseSeederService<GroupEntity> {

  protected convertEntities(data: GroupEntity[]): GroupEntity[] {
    return plainToClass(GroupEntity, data);
  }
}
