import { EntityManager, Repository } from 'typeorm';

import { DataContainers } from './data-container';
import { EntityTransformerService } from './entity-transformer-service';
import { EntityStatistic } from './seed-statistics';

export interface SeederService<Entity> {
  /**
   * Funkce by měla naplnit vybranou tabulku seed daty
   *
   * @param repository Repozitář pro přístup k databázi
   * @param dataContainers Datakontejner aktuální seedovací relace
   * @param data Kolekce obsahující seed data
   * @param entityTransformer Transformovací service pro převod alternativního formátu entity na originální
   * @param entityManager? EntityManager pro přístup k celé databázi
   * @return Počet vložených entit
   */
  seed(repository: Repository<Entity>,
       data: Entity[],
       dataContainers: DataContainers,
       entityTransformer?: EntityTransformerService,
       entityManager?: EntityManager
  ): Promise<[EntityStatistic, Entity[]]>;
}
