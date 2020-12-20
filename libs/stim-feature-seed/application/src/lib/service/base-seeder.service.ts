import { createEmptyEntityStatistic, EntityStatistic, FailedReason, SeederService } from '@diplomka-backend/stim-feature-seed/domain';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export abstract class BaseSeederService<S> implements SeederService<S> {
  protected readonly logger: Logger = new Logger(BaseSeederService.name);

  async seed(repository: Repository<S>, data: S[], entityManager?: EntityManager): Promise<EntityStatistic> {
    const entityStatistics: EntityStatistic = createEmptyEntityStatistic();
    const entities: S[] = this.convertEntities(data);

    for (const entity of entities) {
      try {
        this.logger.verbose('Vkládám do databáze entitu: ' + entity.constructor.name + ' - ' + JSON.stringify(entity));
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

  protected abstract convertEntities(data: S[]): S[];
}
