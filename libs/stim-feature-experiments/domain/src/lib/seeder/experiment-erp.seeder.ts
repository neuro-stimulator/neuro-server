import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentErpEntity } from '../model/entity/experiment-erp.entity';

@Injectable()
@Seeder(ExperimentErpEntity)
export class ExperimentErpSeeder extends BaseSeederService<ExperimentErpEntity> {
  protected convertEntities(data: ExperimentErpEntity[]): ExperimentErpEntity[] {
    return plainToClass(ExperimentErpEntity, data);
  }
}
