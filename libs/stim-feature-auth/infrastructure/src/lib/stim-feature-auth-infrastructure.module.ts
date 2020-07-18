import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModuleConfig } from '@diplomka-backend/stim-feature-auth/domain';

import { AuthFacade } from './service/auth.facade';
import { StimFeatureAuthInfrastructureCoreModule } from './stim-feature-auth-infrastructure-core.module';

@Module({})
export class StimFeatureAuthInfrastructureModule {
  static forRoot(config: AuthModuleConfig): DynamicModule {
    return {
      module: StimFeatureAuthInfrastructureModule,
      imports: [StimFeatureAuthInfrastructureCoreModule.forRoot(config)],
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
