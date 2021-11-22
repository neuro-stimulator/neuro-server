import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { Seeder } from '@neuro-server/stim-feature-seed/domain';
import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';

import { GroupEntity } from '../model/entity/group.entity';

@Injectable()
@Seeder(GroupEntity)
export class GroupSeeder extends BaseSeederService<GroupEntity> {

  protected convertEntities(data: GroupEntity[]): GroupEntity[] {
    return plainToClass(GroupEntity, data);
  }
}
