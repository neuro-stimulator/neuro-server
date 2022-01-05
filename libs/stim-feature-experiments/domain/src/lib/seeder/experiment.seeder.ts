import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentEntity } from '../model/entity/experiment.entity';

@Injectable()
@Seeder(ExperimentEntity)
export class ExperimentSeeder extends BaseSeederService<ExperimentEntity> {
  protected convertEntities(data: ExperimentEntity[]): ExperimentEntity[] {
    return plainToClass(ExperimentEntity, data);
  }
}
