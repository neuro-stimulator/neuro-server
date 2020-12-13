import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { BaseSeederService } from '@diplomka-backend/stim-feature-seed/application';
import { Seeder } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';

@Injectable()
@Seeder(ExperimentStopConditionEntity)
export class ExperimentStopConditionSeeder extends BaseSeederService<ExperimentStopConditionEntity> {
  protected convertEntities(data: ExperimentStopConditionEntity[]): ExperimentStopConditionEntity[] {
    return plainToClass(ExperimentStopConditionEntity, data);
  }
}
