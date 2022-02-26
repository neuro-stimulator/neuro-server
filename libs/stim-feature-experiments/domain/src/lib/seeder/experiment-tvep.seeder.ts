import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentTvepEntity } from '../model/entity/experiment-tvep.entity';

@Injectable()
@Seeder(ExperimentTvepEntity)
export class ExperimentTvepSeeder extends BaseSeederService<ExperimentTvepEntity> {
  protected convertEntities(data: ExperimentTvepEntity[]): ExperimentTvepEntity[] {
    return plainToClass(ExperimentTvepEntity, data);
  }
}
