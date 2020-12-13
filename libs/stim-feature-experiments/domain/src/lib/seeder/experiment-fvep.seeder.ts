import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentFvepEntity } from '../model/entity/experiment-fvep.entity';

@Injectable()
@Seeder(ExperimentFvepEntity)
export class ExperimentFvepSeeder extends BaseSeederService<ExperimentFvepEntity> {
  protected convertEntities(data: ExperimentFvepEntity[]): ExperimentFvepEntity[] {
    return plainToClass(ExperimentFvepEntity, data);
  }
}
