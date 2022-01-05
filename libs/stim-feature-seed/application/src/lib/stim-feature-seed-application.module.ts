import { Module, OnApplicationBootstrap, Type } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EntityTransformerService, SeederService, StimFeatureSeedDomainModule } from '@neuro-server/stim-feature-seed/domain';

import { COMMANDS } from './command';
import { EVENTS } from './event';
import { QUERIES } from './query';
import { SAGAS } from './saga';
import { SeederServiceProvider } from './service/seeder-service-provider.service';
import { SeedExplorerService } from './service/seed-explorer.service';
import { DatabaseDumpService } from './service/database-dump.service';
import { EntityTransformerExplorerService } from './service/entity-transformer-explorer.service';

@Module({
  imports: [CqrsModule, StimFeatureSeedDomainModule],
  providers: [
    ...COMMANDS,
    ...EVENTS,
    ...QUERIES,
    ...SAGAS,
    SeederServiceProvider,
    SeedExplorerService,
    EntityTransformerExplorerService,
    DatabaseDumpService
  ],
  exports: [SeederServiceProvider],
})
export class StimFeatureSeedApplicationModule implements OnApplicationBootstrap {
  constructor(private readonly seedExplorer: SeedExplorerService, private readonly entityTransformerExplorer: EntityTransformerExplorerService,
              private readonly seederService: SeederServiceProvider) {}

  onApplicationBootstrap(): void {
    this.registerSeederServices();
    this.registerSeedTransformerServices();
  }

  protected registerSeederServices() {
    const services: { instance: SeederService<unknown>; entityClass: Type }[] = this.seedExplorer.explore();
    for (const obj of Object.values(services)) {
      this.seederService.registerSeeder(obj.instance, obj.entityClass);
    }
  }

  protected registerSeedTransformerServices() {
    const entityTransformers: { instance: EntityTransformerService; entityClass: Type }[] = this.entityTransformerExplorer.explore();
    for (const obj of Object.values(entityTransformers)) {
      this.seederService.registerEntityTransformer(obj.instance, obj.entityClass);
    }
  }
}
