import { Injectable } from '@nestjs/common';
import { plainToClass } from '@nestjs/class-transformer';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';
import { FindOneOptions } from 'typeorm';

@Injectable()
@Seeder(ExperimentStopConditionEntity)
export class ExperimentStopConditionSeeder extends BaseSeederService<ExperimentStopConditionEntity> {

  protected convertEntities(data: ExperimentStopConditionEntity[]): ExperimentStopConditionEntity[] {
    return plainToClass(ExperimentStopConditionEntity, data);
  }

  protected getFindOneOptions(entity: ExperimentStopConditionEntity): FindOneOptions<ExperimentStopConditionEntity> {
    return {
      where: {
        experimentStopConditionType: entity.experimentStopConditionType,
        experimentType: entity.experimentType
      }
    }
  }
}
