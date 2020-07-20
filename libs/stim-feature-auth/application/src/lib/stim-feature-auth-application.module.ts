import { DynamicModule, Module } from '@nestjs/common';

import { AuthModuleConfig } from '@diplomka-backend/stim-feature-auth/domain';

import { StimFeatureAuthApplicationCoreModule } from './stim-feature-auth-application-core.module';

@Module({})
export class StimFeatureAuthApplicationModule {
  static forRoot(config: AuthModuleConfig): DynamicModule {
    return {
      module: StimFeatureAuthApplicationModule,
      imports: [StimFeatureAuthApplicationCoreModule.forRoot(config)],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAuthApplicationModule,
    };
  }
}
