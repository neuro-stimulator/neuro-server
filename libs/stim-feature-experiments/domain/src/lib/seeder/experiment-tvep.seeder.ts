import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentTvepEntity } from '../model/entity/experiment-tvep.entity';

@Injectable()
@Seeder(ExperimentTvepEntity)
export class ExperimentTvepSeeder extends BaseSeederService<ExperimentTvepEntity> {
  protected convertEntities(data: ExperimentTvepEntity[]): ExperimentTvepEntity[] {
    return plainToClass(ExperimentTvepEntity, data);
  }
}
