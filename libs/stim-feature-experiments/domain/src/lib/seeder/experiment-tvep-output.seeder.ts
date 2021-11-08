import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentTvepOutputEntity } from '../model/entity/experiment-tvep-output.entity';

@Injectable()
@Seeder(ExperimentTvepOutputEntity)
export class ExperimentTvepOutputSeeder extends BaseSeederService<ExperimentTvepOutputEntity> {
  protected convertEntities(data: ExperimentTvepOutputEntity[]): ExperimentTvepOutputEntity[] {
    return plainToClass(ExperimentTvepOutputEntity, data);
  }
}
