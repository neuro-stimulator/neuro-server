import { join } from 'path';
import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { StimLibCommonModule } from '@diplomka-backend/stim-lib-common';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureExperimentsInfrastructureModule } from '@diplomka-backend/stim-feature-experiments/infrastructure';
import { StimFeatureExperimentResultsInfrastructureModule } from '@diplomka-backend/stim-feature-experiment-results/infrastructure';
import { StimFeatureSequencesInfrastructureModule } from '@diplomka-backend/stim-feature-sequences/infrastructure';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';
import { StimFeatureIpcModule } from '@diplomka-backend/stim-feature-ipc';

import { environment } from '../environments/environment';
import { DatabaseConfigurator } from './database-configurator';
import { EmptyModule } from './empty.module';
import { CorsMiddleware } from './cors.middleware';
import { StimFeatureStimulatorInfrastructureModule } from '@diplomka-backend/stim-feature-stimulator/infrastructure';

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

    StimLibCommonModule,
    StimLibSocketModule,
    StimFeatureIpcModule,
    StimFeatureSettingsModule.forRoot({
      fileName: environment.settingsFilename,
    }),
    StimFeatureFileBrowserModule.forRoot({ basePath: environment.appDataRoot }),
    StimFeatureStimulatorInfrastructureModule.forRoot({
      useVirtualSerial: environment.virtualSerialService,
    }),
    StimFeatureExperimentsInfrastructureModule,
    StimFeatureExperimentResultsInfrastructureModule,
    StimFeatureSequencesInfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorsMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
