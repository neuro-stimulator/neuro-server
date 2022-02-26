import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';

@Injectable()
@Seeder(ExperimentFvepEntity)
export class ExperimentFvepSeeder extends BaseSeederService<ExperimentFvepEntity> {
  protected convertEntities(data: ExperimentFvepEntity[]): ExperimentFvepEntity[] {
    return plainToClass(ExperimentFvepEntity, data);
  }
}
