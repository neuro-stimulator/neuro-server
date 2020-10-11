import { join } from 'path';
import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CqrsModule } from '@nestjs/cqrs';

import { StimLibCommonModule } from '@diplomka-backend/stim-lib-common';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureExperimentsInfrastructureModule } from '@diplomka-backend/stim-feature-experiments/infrastructure';
import { StimFeatureExperimentResultsInfrastructureModule } from '@diplomka-backend/stim-feature-experiment-results/infrastructure';
import { StimFeatureSequencesInfrastructureModule } from '@diplomka-backend/stim-feature-sequences/infrastructure';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';
import { StimFeatureIpcModule } from '@diplomka-backend/stim-feature-ipc';
import { StimFeatureStimulatorInfrastructureModule } from '@diplomka-backend/stim-feature-stimulator/infrastructure';
import { StimFeatureUsersInfrastructureModule } from '@diplomka-backend/stim-feature-users/infrastructure';
import { StimFeatureAuthInfrastructureModule } from '@diplomka-backend/stim-feature-auth/infrastructure';
import { StimFeaturePlayerInfrastructureModule } from '@diplomka-backend/stim-feature-player/infrastructure';
import { StimLibConnectionInfrastructureModule } from '@diplomka-backend/stim-lib-connection/infrastructure';
import { StimFeatureSeedInfrastructureModule } from '@diplomka-backend/stim-feature-seed/infrastructure';

import { environment } from '../environments/environment';
import { DatabaseConfigurator } from './database-configurator';
import { EmptyModule } from './empty.module';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigurator,
    }),
    process.env.PRODUCTION === 'true'
      ? ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'client/diplomka-frontend'),
        })
      : EmptyModule,
    CqrsModule,

    StimLibCommonModule,
    StimLibSocketModule,
    StimLibConnectionInfrastructureModule,
    StimFeatureIpcModule,
    StimFeatureSettingsModule.forRoot({
      fileName: environment.settingsFilename,
    }),
    StimFeatureFileBrowserModule.forRoot({ basePath: environment.appDataRoot }),
    StimFeatureUsersInfrastructureModule,
    StimFeatureAuthInfrastructureModule.forRoot({
      jwtToken: 'DEMO_TOKEN',
      accessTokenTTL: 60 * 60 * 24, // 24h
      refreshTokenLength: 64,
    }),
    StimFeatureStimulatorInfrastructureModule.forRoot({
      useVirtualSerial: environment.virtualSerialService,
      useVirtualSerialFactory: environment.virtualSerialService,
    }),
    StimFeatureExperimentsInfrastructureModule,
    StimFeatureExperimentResultsInfrastructureModule,
    StimFeatureSequencesInfrastructureModule,
    StimFeaturePlayerInfrastructureModule,
    StimFeatureSeedInfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
