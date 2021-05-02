import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { ACCESS_TOKEN_TTL, AuthModuleConfig, JWT_KEY, REFRESH_TOKEN_LENGTH, REFRESH_TOKEN_TTL, StimFeatureAuthDomainModule } from '@diplomka-backend/stim-feature-auth/domain';

import { AuthService } from './service/auth.service';
import { TokenService } from './service/token.service';
import { QueryHandlers } from './query';
import { CommandHandlers } from './command';
import { EventHandlers } from './event';
import { AuthGuard } from './guard/auth.guard';

@Module({})
export class StimFeatureAuthApplicationCoreModule {
  static forRoot(config: AuthModuleConfig): DynamicModule {
    return {
      module: StimFeatureAuthApplicationCoreModule,
      imports: [CqrsModule, StimFeatureAuthDomainModule],
      providers: [
        {
          provide: JWT_KEY,
          useValue: config.jwtToken,
        },
        {
          provide: ACCESS_TOKEN_TTL,
          useValue: config.accessTokenTTL,
        },
        {
          provide: REFRESH_TOKEN_TTL,
          useValue: config.refreshTokenTTL
        },
        {
          provide: REFRESH_TOKEN_LENGTH,
          useValue: config.refreshTokenLength,
        },
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
