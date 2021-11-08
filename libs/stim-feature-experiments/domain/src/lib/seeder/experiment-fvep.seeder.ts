import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@neuro-server/stim-feature-seed/application';
import { Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';

@Injectable()
@Seeder(ExperimentFvepEntity)
export class ExperimentFvepSeeder extends BaseSeederService<ExperimentFvepEntity> {
  protected convertEntities(data: ExperimentFvepEntity[]): ExperimentFvepEntity[] {
    return plainToClass(ExperimentFvepEntity, data);
  }
}
