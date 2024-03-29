import { EntityManager, EntityMetadata, QueryFailedError, DeepPartial } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import {
  createEmptyEntityStatistic,
  DataContainer,
  DataContainers,
  EntityStatistic,
  FailedReason,
  SeederInformation,
  SeederService,
  SeedStatistics,
  EntityTransformerService
} from '@neuro-server/stim-feature-seed/domain';

import { SeedRepositoryEvent } from '../event/impl/seed-repository.event';

@Injectable()
export class SeederServiceProvider {
  private readonly logger: Logger = new Logger(SeederServiceProvider.name);

  private readonly _seederServices: Record<string, SeederInformation> = {};

  /**
   * Komparátor {@link SeederInformation} řadící dle vlastnosti {@link SeederInformation#order}
   *
   * @param lhs První argument komparátoru
   * @param rhs Druhý argument komparátoru
   */
  private readonly _informationComparator: (lhs: SeederInformation, rhs: SeederInformation) => number = (lhs: SeederInformation, rhs: SeederInformation) => {
    return lhs.order - rhs.order;
  };

  /**
   * Pomocná implementace transform service, která vrátí nezměněnou entitu
   */
  private readonly _entityEmptyTransformer: EntityTransformerService = {
    transform(fromType: any, _dataContainers: DataContainers): DeepPartial<any> {
      return fromType;
    }
  };

  constructor(private readonly _manager: EntityManager, private readonly eventBus: EventBus) {}

  /**
   * Zaregistruje jednu seeder service pro jednu entitu.
   *
   * @param seeder {@link SeederService}
   * @param entity Database entity
   * @param order Priorita importu entity
   */
  public registerSeeder(seeder: SeederService<unknown>, entity: any, order = 0): void {
    this.logger.verbose(`Registruji seeder pro entitu: ${entity.name}.`);
    let information: SeederInformation = this._seederServices[entity.name];
    if (!information) {
      information = {
        entity: entity,
        services: [],
        order: order,
      };
      this._seederServices[entity.name] = information;
    }
    information.services.push(seeder);
  }

  /**
   * Zaregistruje jeden entity transformer pro jednu entitu.
   *
   * @param transformer {@link EntityTransformerService}
   * @param entity Database entity
   */
  public registerEntityTransformer(transformer: EntityTransformerService, entity: any): void {
    this.logger.verbose(`Registruji seed transformer pro entitu: ${entity.name}.`);
    const information: SeederInformation = this._seederServices[entity.name];
    information.transformer = transformer;
  }

  /**
   * Provede vlastní seedování databáze.
   */
  public async seedDatabase(dataContainer: DataContainers): Promise<SeedStatistics> {
    const seedStatistics: SeedStatistics = {};
    for (const information of this._orderServiceInformations(this._manager.connection.entityMetadatas)) {
      const repository = this._manager.getRepository(information.entity);
      const data: DataContainer[] = dataContainer[information.entity.name];
      if (!data) {
        continue;
      }

      const plainEntities = data.map((container: DataContainer) => container.entities).reduce((prev, curr) => prev.concat(curr), []);
      const useTransformer = data.some((container: DataContainer) => container.invokeEntityTransformer);
      for (const seeder of information.services) {
        const [statistics, entities] = await seeder.seed(
          repository,
          plainEntities,
          dataContainer,
          useTransformer ? information.transformer : this._entityEmptyTransformer,
          this._manager
        );
        seedStatistics[information.entity.name] = statistics
        this.eventBus.publish(new SeedRepositoryEvent(information.entity, entities));
      }
    }

    return seedStatistics;
  }

  /**
   * Vymaže kompletně celou databázi.
   * Vyresetuje všechny sqlite sequence.
   */
  public async truncateDatabase(): Promise<SeedStatistics> {
    const statistics: SeedStatistics = {};
    const entities = this._manager.connection.entityMetadatas;
    for (const entity of this._orderEntities(entities)) {
      const entityStatistics: EntityStatistic = createEmptyEntityStatistic();
      try {
        const repository = this._manager.getRepository(entity.name);
        const count = await repository.count();
        await repository.query(`DELETE FROM ${entity.tableName};`);
        // Reset IDs
        await repository.query(`DELETE FROM sqlite_sequence WHERE name='${entity.tableName}'`);
        entityStatistics.successful.deleted = count;
      } catch (error) {
        if (error instanceof QueryFailedError) {
          entityStatistics.failed.deleted.count = 0;
          const queryError: QueryFailedError = error;
          const failedReason: FailedReason = {
            code: queryError['code'],
            errno: queryError['errno'],
            message: queryError.message,
            query: queryError['query'],
            parameters: queryError['parameters'],
          };
          entityStatistics.failed.deleted.reason.push(failedReason);
        }
      }
      statistics[entity.name] = entityStatistics;
    }

    return statistics;
  }

  /**
   * Seřadí zadané entity dle relací mezi entitami
   *
   * @param entities Metadata entit
   */
  private _orderEntities(entities: EntityMetadata[]): EntityMetadata[] {
    const dependencies: Record<string, number> = {};
    const stack = [...entities];

    // Projdu všechny entity do hloubky společně s jejich závislostmi
    while (stack.length !== 0) {
      const entity = stack.pop();
      if (!entity) continue;
      const entityName = entity.name;
      // Inicializuji závislost pokud je potřeba
      if (dependencies[entityName] === undefined) {
        dependencies[entityName] = 0;
      } else {
        // Entita již existuje, zvýším počet závislých tabulek
        dependencies[entityName]++;
      }

      // Vyhledám všechny tabulky, na kterých je aktuální entita závislo
      // Musím vyfiltrovat závislost sám na sebe
      const relations: EntityMetadata[] = entity.ownRelations.filter((relation) => relation.type != entity.target).map((relation) => relation.inverseEntityMetadata);
      stack.push(...relations);
    }

    // Nakonec všechny entity seřadím podle počtu závislostí tak,
    // abych nejdříve vymazal entity bez žádných závislostí

    return entities.sort((lhs: EntityMetadata, rhs: EntityMetadata) => dependencies[lhs.name] - dependencies[rhs.name]);
  }

  private _orderServiceInformations(inputEntities: EntityMetadata[]): SeederInformation[] {
    const entities: string[] = this._orderEntities(inputEntities)
      .map((entity: EntityMetadata) => entity.targetName)
      .reverse();
    return Object.values(this._seederServices).sort(
      (lhs: SeederInformation, rhs: SeederInformation) => entities.findIndex((entity) => entity === lhs.entity.name) - entities.findIndex((entity) => entity === rhs.entity.name)
    );
  }

  get orderedServiceInformations(): SeederInformation[] {
    return Object.values(this._seederServices).sort(this._informationComparator);
  }

  get seederServices(): Record<string, SeederInformation> {
    return this._seederServices;
  }
}
