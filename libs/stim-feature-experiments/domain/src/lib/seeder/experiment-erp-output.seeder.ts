import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentErpOutputEntity } from '../model/entity/experiment-erp-output.entity';

@Injectable()
@Seeder(ExperimentErpOutputEntity)
export class ExperimentErpOutputSeeder extends BaseSeederService<ExperimentErpOutputEntity> {
  protected convertEntities(data: ExperimentErpOutputEntity[]): ExperimentErpOutputEntity[] {
    return plainToClass(ExperimentErpOutputEntity, data);
  }
}
