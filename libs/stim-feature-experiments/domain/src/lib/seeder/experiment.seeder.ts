import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentEntity } from '../model/entity/experiment.entity';

@Injectable()
@Seeder(ExperimentEntity)
export class ExperimentSeeder extends BaseSeederService<ExperimentEntity> {
  protected convertEntities(data: ExperimentEntity[]): ExperimentEntity[] {
    return plainToClass(ExperimentEntity, data);
  }
}
