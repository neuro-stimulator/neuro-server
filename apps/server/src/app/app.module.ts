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

// import { SequencesModule } from "./sequences/sequences.module";
// import { SettingsModule } from './settings/settings.module';
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
    StimFeatureFileBrowserModule.forRoot({ basePath: '/tmp/stimulator' }),
    StimFeatureStimulatorModule,
    StimFeatureExperimentsModule,
    StimFeatureExperimentResultsModule,
    // ExperimentResultsModule,
    // FileBrowserModule,
    // SequencesModule,
    // LowLevelModule,
    // CommandsModule,
    // SettingsModule,
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
