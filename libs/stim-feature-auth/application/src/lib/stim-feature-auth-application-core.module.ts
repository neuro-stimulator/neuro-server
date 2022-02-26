import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { StimFeatureAuthDomainModule } from '@neuro-server/stim-feature-auth/domain';

import { CommandHandlers } from './command';
import { EventHandlers } from './event';
import { AuthGuard } from './guard/auth.guard';
import { QueryHandlers } from './query';
import { AuthService } from './service/auth.service';
import { TokenService } from './service/token.service';

@Module({})
export class StimFeatureAuthApplicationCoreModule {

  static forRootAsync(): DynamicModule {
    return {
      module: StimFeatureAuthApplicationCoreModule,
      imports: [
        CqrsModule,
        StimFeatureAuthDomainModule.forRootAsync()
      ],
      providers: [
        {
          provide: APP_GUARD,
          useExisting: AuthGuard,
        },

        AuthGuard,
        AuthService,
        TokenService,

        ...QueryHandlers,
        ...CommandHandlers,
        ...EventHandlers,
      ],
    };
  }
}
