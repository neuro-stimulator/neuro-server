import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentErpOutputDependencyEntity } from '../model/entity/experiment-erp-output-dependency.entity';

@Injectable()
@Seeder(ExperimentErpOutputDependencyEntity)
export class ExperimentErpOutputDependencySeeder extends BaseSeederService<ExperimentErpOutputDependencyEntity> {
  protected convertEntities(data: ExperimentErpOutputDependencyEntity[]): ExperimentErpOutputDependencyEntity[] {
    return plainToClass(ExperimentErpOutputDependencyEntity, data);
  }
}
