import { DeepPartial } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentResultEntity } from '../model/entity/experiment-result.entity';

@Injectable()
@Seeder(ExperimentResultEntity)
export class ExperimentResultSeeder extends BaseSeederService<ExperimentResultEntity> {
  protected convertEntities(data: ExperimentResultEntity[]): DeepPartial<ExperimentResultEntity>[] {
    return plainToClass(ExperimentResultEntity, data);
  }
}
