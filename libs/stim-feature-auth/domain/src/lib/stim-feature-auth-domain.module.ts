import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureAuthDomainCoreModule } from './stim-feature-auth-domain-core.module';

@Module({})
export class StimFeatureAuthDomainModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAuthDomainModule,
      imports: [StimFeatureAuthDomainCoreModule.forRootAsync()]
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAuthDomainModule
    };
  }

}
