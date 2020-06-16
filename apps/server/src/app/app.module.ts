import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { StimFeatureExperimentsModule } from '@diplomka-backend/stim-feature-experiments';
import { StimLibSocketModule } from '@diplomka-backend/stim-lib-socket';
import { StimFeatureStimulatorModule } from '@diplomka-backend/stim-feature-stimulator';
import {
  StimFeatureFileBrowserModule,
  TOKEN_BASE_PATH,
} from '@diplomka-backend/stim-feature-file-browser';

// import { ExperimentResultsModule } from "./experiment-results/experiment-results.module";
// import { FileBrowserModule } from "./file-browser/file-browser.module";
// import { SequencesModule } from "./sequences/sequences.module";
// import { LowLevelModule } from "./low-level/low-level.module";
// import { CommandsModule } from "./commands/commands.module";
import { SettingsModule } from './settings/settings.module';
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
