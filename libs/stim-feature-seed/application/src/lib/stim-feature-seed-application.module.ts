import { Module, OnApplicationBootstrap, Type } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SeederService, StimFeatureSeedDomainModule } from '@diplomka-backend/stim-feature-seed/domain';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { COMMANDS } from './command';
import { EVENTS } from './event';
import { QUERIES } from './query';
import { SAGAS } from './saga';
import { SeederServiceProvider } from './service/seeder-service-provider.service';
import { SeedExplorerService } from './service/seed-explorer.service';
import { DatabaseDumpService } from './service/database-dump.service';

@Module({
  imports: [CqrsModule, StimFeatureSeedDomainModule, StimFeatureFileBrowserModule.forFeature()],
  providers: [...COMMANDS, ...EVENTS, ...QUERIES, ...SAGAS, SeederServiceProvider, SeedExplorerService, DatabaseDumpService],
  exports: [SeederServiceProvider],
})
export class StimFeatureSeedApplicationModule implements OnApplicationBootstrap {
  constructor(private readonly seedExplorer: SeedExplorerService, private readonly seederService: SeederServiceProvider) {}

  onApplicationBootstrap(): any {
    const services: { instance: SeederService<unknown>; entityClass: Type<any> }[] = this.seedExplorer.explore();
    for (const obj of Object.values(services)) {
      this.seederService.registerSeeder(obj.instance, obj.entityClass);
    }
  }
}
