import { Injectable, Logger } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { createEmptyEntityStatistic, EntityStatistic, FailedReason, SeederService } from '@diplomka-backend/stim-feature-seed/domain';

import { ExperimentStopConditionEntity } from '../model/entity/experiment-stop-condition.entity';

@Injectable()
export class ExperimentStopConditionSeeder implements SeederService<ExperimentStopConditionEntity> {
  private readonly logger: Logger = new Logger(ExperimentStopConditionSeeder.name);

  async seed(repository: Repository<ExperimentStopConditionEntity>, data: ExperimentStopConditionEntity[]): Promise<EntityStatistic> {
    const entityStatistics: EntityStatistic = createEmptyEntityStatistic();
    this.logger.verbose('Seeduji stop condition tabulku s daty.');
    const entities = plainToClass(ExperimentStopConditionEntity, data);

    for (const entity of entities) {
      try {
        await repository.insert(entity);
        entityStatistics.successful.inserted++;
      } catch (error) {
        entityStatistics.failed.inserted.count++;
        if (error instanceof QueryFailedError) {
          const queryError: QueryFailedError = error;
          const failedReason: FailedReason = {
            code: queryError['code'],
            errno: queryError['errno'],
            message: queryError.message,
            query: queryError['query'],
            parameters: queryError['parameters'],
          };
          entityStatistics.failed.inserted.reason.push(failedReason);
        }
      }
    }

    return entityStatistics;
  }
}
