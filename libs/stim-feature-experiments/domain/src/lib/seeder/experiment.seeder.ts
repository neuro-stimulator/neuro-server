import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentEntity } from '../model/entity/experiment.entity';

@Injectable()
@Seeder(ExperimentEntity)
export class ExperimentSeeder extends BaseSeederService<ExperimentEntity> {
  protected convertEntities(data: ExperimentEntity[]): DeepPartial<ExperimentEntity>[] {
    return plainToClass(ExperimentEntity, data);
  }
}
