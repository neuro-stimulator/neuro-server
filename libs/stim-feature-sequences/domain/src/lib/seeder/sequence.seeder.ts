import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { SequenceEntity } from '../model/entity/sequence.entity';

@Injectable()
@Seeder(SequenceEntity)
export class SequenceSeeder extends BaseSeederService<SequenceEntity> {
  protected convertEntities(data: SequenceEntity[]): SequenceEntity[] {
    return plainToClass(SequenceEntity, data);
  }
}
