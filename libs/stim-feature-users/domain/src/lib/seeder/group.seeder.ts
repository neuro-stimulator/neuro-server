import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';
import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';

import { GroupEntity } from '../model/entity/group.entity';

@Injectable()
@Seeder(GroupEntity)
export class GroupSeeder extends BaseSeederService<GroupEntity> {

  protected convertEntities(data: GroupEntity[]): GroupEntity[] {
    return plainToClass(GroupEntity, data);
  }
}
