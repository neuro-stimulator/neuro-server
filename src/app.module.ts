import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

import { CorsMiddleware } from './cors.middleware';
import { ExperimentsModule } from './experiments/experiments.module';
import { LowLevelModule } from './low-level/low-level.module';
import { SequenceModule } from './sequence/sequence.module';
import { CommandsModule } from './commands/commands.module';
import { ExperimentResultsModule } from './experiment-results/experiment-results.module';
import { FileBrowserModule } from './file-browser/file-browser.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    InMemoryDBModule.forRoot(),

    ExperimentsModule,
    ExperimentResultsModule,
    FileBrowserModule,
    SequenceModule,
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
