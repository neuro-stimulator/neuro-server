import { DynamicModule, Module } from '@nestjs/common';

import { StimFeatureAuthApplicationCoreModule } from './stim-feature-auth-application-core.module';

@Module({})
export class StimFeatureAuthApplicationModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAuthApplicationModule,
      imports: [StimFeatureAuthApplicationCoreModule.forRootAsync()],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAuthApplicationModule
    };
  }
}
