import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { SequenceEntity } from '../model/entity/sequence.entity';

@Injectable()
@Seeder(SequenceEntity)
export class SequenceSeeder extends BaseSeederService<SequenceEntity> {
  protected convertEntities(data: SequenceEntity[]): SequenceEntity[] {
    return plainToClass(SequenceEntity, data);
  }
}
