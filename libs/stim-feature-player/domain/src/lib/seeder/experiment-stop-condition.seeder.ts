import { FindOneOptions } from 'typeorm';

import { plainToClass } from '@nestjs/class-transformer';
import { Injectable } from '@nestjs/common';

import { BaseSeederService, Seeder } from '@neuro-server/stim-feature-seed/domain';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';

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
