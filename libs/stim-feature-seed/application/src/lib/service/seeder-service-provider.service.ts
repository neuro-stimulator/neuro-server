import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { SeederService, SeedStatistics } from '@diplomka-backend/stim-feature-seed/domain';

@Injectable()
export class SeederServiceProvider {
  private readonly logger: Logger = new Logger(SeederServiceProvider.name);

  private readonly _seederServices: Map<any, SeederService<unknown>[]> = new Map<any, SeederService<unknown>[]>();

  constructor(private readonly _manager: EntityManager) {}

  /**
   * Register one seeder service for entity
   *
   * @param seeder Seeder service
   * @param entity Database entity
   */
  public registerSeeder(seeder: SeederService<unknown>, entity: any): void {
    this.logger.verbose(`Registruji seeder pro entitu: ${entity}.`);
    let services: SeederService<unknown>[] = this._seederServices[entity];
    if (!services) {
      services = [];
      this._seederServices.set(entity, services);
    }

    services.push(seeder);
  }

  /**
   * Provede vlastní seedování databáze.
   */
  public async seedDatabase(dataContainer: Record<string, []>): Promise<SeedStatistics> {
    const seedStatistics: SeedStatistics = {};
    for (const [entity, seeders] of this._seederServices.entries()) {
      const repository = this._manager.getRepository(entity);
      const data = dataContainer[entity.name];
      for (const seeder of seeders) {
        this.logger.verbose(`Seeding database for entity: ${entity.name}.`);
        seedStatistics[entity.name] = await seeder.seed(repository, data, this._manager);
      }
    }

    return seedStatistics;
  }
}
