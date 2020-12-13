import { Module, OnApplicationBootstrap, Type } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SeederService, StimFeatureSeedDomainModule } from '@diplomka-backend/stim-feature-seed/domain';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';

import { COMMANDS } from './command/index';
import { EVENTS } from './event/index';
import { QUERIES } from './query/index';
import { SAGAS } from './saga/index';
import { SeederServiceProvider } from './service/seeder-service-provider.service';
import { SeedExplorerService } from './service/seed-explorer.service';

@Module({
  imports: [CqrsModule, StimFeatureSeedDomainModule, StimFeatureFileBrowserModule.forFeature()],
  providers: [...COMMANDS, ...EVENTS, ...QUERIES, ...SAGAS, SeederServiceProvider, SeedExplorerService],
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
