import { Logger } from '@nestjs/common';
import { EntityManager, FindOneOptions, QueryFailedError, Repository } from 'typeorm';

import { SeederService } from '../model/seeder-service';
import { DataContainers } from '../model/data-container';
import { EntityTransformerService } from '../model/entity-transformer-service';
import { createEmptyEntityStatistic, EntityStatistic, FailedReason } from '../model/seed-statistics';

export abstract class BaseSeederService<S> implements SeederService<S> {
  protected readonly logger: Logger = new Logger(BaseSeederService.name);

  async seed(
    repository: Repository<S>,
    data: S[],
    dataContainers: DataContainers,
    entityTransformer?: EntityTransformerService,
    entityManager?: EntityManager)
    : Promise<[EntityStatistic, S[]]> {
    const entityStatistics: EntityStatistic = createEmptyEntityStatistic();
    const transformedEntities = this.transformEntities(data, dataContainers, entityTransformer);
    const entities: S[] = this.convertEntities(transformedEntities);
    const insertedEntities: S[] = [];

    for (const entity of entities) {
      try {
        this.logger.verbose('Vkládám do databáze entitu: ' + entity.constructor.name + ' - ' + JSON.stringify(entity));
        const savedEntity = await repository.save(entity);
        const loadedEntity = await repository.findOne(this.getFindOneOptions(savedEntity));
        insertedEntities.push(loadedEntity);
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
        } else {
          this.logger.error(error);
        }
      }
    }

    return [entityStatistics, insertedEntities];
  }

  protected transformEntities(data: S[], dataContainers: DataContainers, transformer?: EntityTransformerService): S[] {
    if (!transformer) {
      return data;
    }

    return data.map(entity => {
        return transformer.transform(entity, dataContainers) as S;
    });
  }

  protected abstract convertEntities(data: S[]): S[];

  protected getFindOneOptions(entity: S): FindOneOptions<S> {
    return {
      where: {
        id: entity['id']
      }
    }
  }
}
