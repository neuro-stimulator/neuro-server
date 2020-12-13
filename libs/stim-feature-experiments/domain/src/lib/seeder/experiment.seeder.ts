import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentEntity } from '../model/entity/experiment.entity';

@Injectable()
@Seeder(ExperimentEntity)
export class ExperimentSeeder extends BaseSeederService<ExperimentEntity> {
  protected convertEntities(data: ExperimentEntity[]): ExperimentEntity[] {
    return plainToClass(ExperimentEntity, data);
  }
}
