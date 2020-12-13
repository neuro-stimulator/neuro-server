import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentFvepOutputEntity } from '../model/entity/experiment-fvep-output.entity';

@Injectable()
@Seeder(ExperimentFvepOutputEntity)
export class ExperimentFvepOutputSeeder extends BaseSeederService<ExperimentFvepOutputEntity> {
  protected convertEntities(data: ExperimentFvepOutputEntity[]): ExperimentFvepOutputEntity[] {
    return plainToClass(ExperimentFvepOutputEntity, data);
  }
}
