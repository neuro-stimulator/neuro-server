import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CorsMiddleware } from './cors.middleware';
import { ExperimentsModule } from './experiments/experiments.module';
import { LowLevelModule } from './low-level/low-level.module';
import { SequencesModule } from './sequences/sequences.module';
import { CommandsModule } from './commands/commands.module';
import { ExperimentResultsModule } from './experiment-results/experiment-results.module';
import { FileBrowserModule } from './file-browser/file-browser.module';
import { SettingsModule } from './settings/settings.module';
import { DatabaseConfigurator } from './database-configurator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigurator
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    InMemoryDBModule.forRoot(),

    ExperimentsModule,
    ExperimentResultsModule,
    FileBrowserModule,
    SequencesModule,
    LowLevelModule,
    CommandsModule,
    SettingsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CorsMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
