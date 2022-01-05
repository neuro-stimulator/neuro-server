import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentResultEntity } from '../model/entity/experiment-result.entity';

@Injectable()
@Seeder(ExperimentResultEntity)
export class ExperimentResultSeeder extends BaseSeederService<ExperimentResultEntity> {
  protected convertEntities(data: ExperimentResultEntity[]): ExperimentResultEntity[] {
    return plainToClass(ExperimentResultEntity, data);
  }
}
