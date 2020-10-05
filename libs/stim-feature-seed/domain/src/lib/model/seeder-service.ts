import { EntityManager, Repository } from 'typeorm';

import { EntityStatistic } from './seed-statistics';

export interface SeederService<Entity> {
  /**
   * Funkce by měla naplnit vybranou tabulku seed daty
   *
   * @param repository Repozitář pro přístup k databázi
   * @param data Kolekce obsahující seed data
   * @param entityManager EntityManager pro přístup k celé databázi
   * @return Počet vložených entit
   */
  seed(repository: Repository<Entity>, data: Entity[], entityManager?: EntityManager): Promise<EntityStatistic>;
}
