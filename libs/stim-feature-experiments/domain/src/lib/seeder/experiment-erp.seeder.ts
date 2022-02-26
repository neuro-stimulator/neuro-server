import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentErpEntity } from '../model/entity/experiment-erp.entity';

@Injectable()
@Seeder(ExperimentErpEntity)
export class ExperimentErpSeeder extends BaseSeederService<ExperimentErpEntity> {
  protected convertEntities(data: ExperimentErpEntity[]): ExperimentErpEntity[] {
    return plainToClass(ExperimentErpEntity, data);
  }
}
