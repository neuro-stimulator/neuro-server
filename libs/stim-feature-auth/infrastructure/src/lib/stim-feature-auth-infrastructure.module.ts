import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthFacade } from './service/auth.facade';
import { StimFeatureAuthInfrastructureCoreModule } from './stim-feature-auth-infrastructure-core.module';

@Module({})
export class StimFeatureAuthInfrastructureModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAuthInfrastructureModule,
      imports: [StimFeatureAuthInfrastructureCoreModule.forRootAsync()],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: StimFeatureAuthInfrastructureModule,
      imports: [CqrsModule],
      providers: [AuthFacade],
      exports: [AuthFacade],
    };
  }
}
