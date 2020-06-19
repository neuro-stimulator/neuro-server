import { join } from 'path';
import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { StimFeatureExperimentsModule } from '@diplomka-backend/stim-feature-experiments';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureStimulatorModule } from '@diplomka-backend/stim-feature-stimulator';
import { StimFeatureFileBrowserModule } from '@diplomka-backend/stim-feature-file-browser';
import { StimFeatureExperimentResultsModule } from '@diplomka-backend/stim-feature-experiment-results';
import { StimFeatureSequencesModule } from '@diplomka-backend/stim-feature-sequences';
import { StimFeatureSettingsModule } from '@diplomka-backend/stim-feature-settings';
import { StimFeatureIpcModule } from '@diplomka-backend/stim-feature-ipc';

import { environment } from '../environments/environment';
import { DatabaseConfigurator } from './database-configurator';
import { EmptyModule } from './empty.module';
import { CorsMiddleware } from './cors.middleware';

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

    StimLibSocketModule,
    StimFeatureSettingsModule.forRoot({
      fileName: environment.settingsFilename,
    }),
    StimFeatureFileBrowserModule.forRoot({ basePath: environment.appDataRoot }),
    StimFeatureStimulatorModule.forRoot({
      useVirtualSerial: environment.virtualSerialService,
    }),
    StimFeatureExperimentsModule,
    StimFeatureExperimentResultsModule,
    StimFeatureSequencesModule,
    StimFeatureIpcModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
