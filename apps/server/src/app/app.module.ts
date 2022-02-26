import * as path from 'path';

import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ServeStaticModule } from '@nestjs/serve-static';

import { StimFeatureAclInfrastructureModule } from '@neuro-server/stim-feature-acl/infrastructure';
import { StimFeatureAuthInfrastructureModule } from '@neuro-server/stim-feature-auth/infrastructure';
import { StimFeatureExperimentResultsInfrastructureModule } from '@neuro-server/stim-feature-experiment-results/infrastructure';
import { StimFeatureExperimentsInfrastructureModule } from '@neuro-server/stim-feature-experiments/infrastructure';
import { StimFeatureFileBrowserInfrastructureModule } from '@neuro-server/stim-feature-file-browser/infrastructure';
import { StimFeatureIpcInfrastructureModule } from '@neuro-server/stim-feature-ipc/infrastructure';
import { StimFeaturePlayerInfrastructureModule } from '@neuro-server/stim-feature-player/infrastructure';
import { StimFeatureSeedInfrastructureModule } from '@neuro-server/stim-feature-seed/infrastructure';
import { StimFeatureSequencesInfrastructureModule } from '@neuro-server/stim-feature-sequences/infrastructure';
import { StimFeatureSettingsModule } from '@neuro-server/stim-feature-settings';
import { StimFeatureStimulatorInfrastructureModule } from '@neuro-server/stim-feature-stimulator/infrastructure';
import { StimFeatureTriggersInfrastructureModule } from '@neuro-server/stim-feature-triggers/infrastructure';
import { StimFeatureUsersInfrastructureModule } from '@neuro-server/stim-feature-users/infrastructure';
import { StimLibCommonModule } from '@neuro-server/stim-lib-common';
import { StimLibConnectionInfrastructureModule } from '@neuro-server/stim-lib-connection/infrastructure';
import { StimLibDatabaseModule } from '@neuro-server/stim-lib-database';
import { StimLibDtoModule } from '@neuro-server/stim-lib-dto';
import { StimLibLogModule } from '@neuro-server/stim-lib-log';
import { StimLibSocketModule } from '@neuro-server/stim-lib-socket';

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

    StimLibLogModule.forRoot(),
    StimLibCommonModule.forRoot(),
    StimLibSocketModule,
    StimLibDatabaseModule.forRoot(),
    StimLibConnectionInfrastructureModule,
    StimLibDtoModule.forRoot(),
    StimFeatureTriggersInfrastructureModule,
    StimFeatureIpcInfrastructureModule.forRootAsync(),
    StimFeatureSettingsModule.forRootAsync(),
    StimFeatureFileBrowserInfrastructureModule.forRootAsync(),
    StimFeatureUsersInfrastructureModule,
    StimFeatureAuthInfrastructureModule.forRootAsync(),
    StimFeatureAclInfrastructureModule.forRootAsync(),
    StimFeatureStimulatorInfrastructureModule.forRootAsync(),
    StimFeatureExperimentsInfrastructureModule,
    StimFeatureExperimentResultsInfrastructureModule,
    StimFeatureSequencesInfrastructureModule,
    StimFeaturePlayerInfrastructureModule,
    StimFeatureSeedInfrastructureModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
