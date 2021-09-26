import * as path from 'path';

import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

import { StimLibCommonModule } from '@diplomka-backend/stim-lib-common';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimLibDatabaseModule } from '@diplomka-backend/stim-lib-database';
import { StimFeatureTriggersInfrastructureModule } from '@diplomka-backend/stim-feature-triggers/infrastructure';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureExperimentsInfrastructureModule } from '@diplomka-backend/stim-feature-experiments/infrastructure';
import { StimFeatureExperimentResultsInfrastructureModule } from '@diplomka-backend/stim-feature-experiment-results/infrastructure';
import { StimFeatureSequencesInfrastructureModule } from '@diplomka-backend/stim-feature-sequences/infrastructure';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';
import { StimFeatureIpcInfrastructureModule } from '@diplomka-backend/stim-feature-ipc/infrastructure';
import { StimFeatureStimulatorInfrastructureModule } from '@diplomka-backend/stim-feature-stimulator/infrastructure';
import { StimFeatureUsersInfrastructureModule } from '@diplomka-backend/stim-feature-users/infrastructure';
import { StimFeatureAuthInfrastructureModule } from '@diplomka-backend/stim-feature-auth/infrastructure';
import { StimFeaturePlayerInfrastructureModule } from '@diplomka-backend/stim-feature-player/infrastructure';
import { StimLibConnectionInfrastructureModule } from '@diplomka-backend/stim-lib-connection/infrastructure';
import { StimFeatureSeedInfrastructureModule } from '@diplomka-backend/stim-feature-seed/infrastructure';

import { EmptyModule } from './empty.module';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [path.join(__dirname, '.env.local'), '.env.local']
      //                    production/development           qa
    }),
    process.env.PRODUCTION === 'true'
      ? ServeStaticModule.forRoot({
          rootPath: process.env.STATIC_FILES_ROOT,
        })
      : EmptyModule,
    CqrsModule,

    StimLibCommonModule.forRoot(),
    StimLibSocketModule,
    StimLibDatabaseModule.forRoot(),
    StimLibConnectionInfrastructureModule,
    StimFeatureTriggersInfrastructureModule,
    StimFeatureIpcInfrastructureModule.forRootAsync(),
    StimFeatureSettingsModule.forRootAsync(),
    StimFeatureFileBrowserModule.forRootAsync(),
    StimFeatureUsersInfrastructureModule,
    StimFeatureAuthInfrastructureModule.forRootAsync(),
    StimFeatureStimulatorInfrastructureModule.forRootAsync(),
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
