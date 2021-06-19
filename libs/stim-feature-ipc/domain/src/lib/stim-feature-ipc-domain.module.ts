import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureIpcDomainCoreModule } from './stim-feature-ipc-domain-core.module';

@Module({})
export class StimFeatureIpcDomainModule {

    static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureIpcDomainModule,
      imports: [StimFeatureIpcDomainCoreModule.forRootAsync()]
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureIpcDomainModule,
    }
  }

}
