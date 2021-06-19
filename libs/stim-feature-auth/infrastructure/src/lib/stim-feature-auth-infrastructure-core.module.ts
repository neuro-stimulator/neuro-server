import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureAuthApplicationModule } from '@diplomka-backend/stim-feature-auth/application';

import { AuthController } from './controller/auth.controller';
import { AuthFacade } from './service/auth.facade';

@Module({})
export class StimFeatureAuthInfrastructureCoreModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAuthInfrastructureCoreModule,
      controllers: [AuthController],
      imports: [CqrsModule, StimFeatureAuthApplicationModule.forRootAsync()],
      providers: [AuthFacade],
    };
  }
}
