import * as path from 'path';

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';

import { CorsMiddleware } from './cors.middleware';
import { ExperimentsModule } from './experiments/experiments.module';
import { LowLevelModule } from './low-level/low-level.module';
import { SequenceModule } from './sequence/sequence.module';
import { CommandsModule } from './commands/commands.module';
import { ExperimentResultsModule } from './experiment-results/experiment-results.module';
import { FileBrowserModule } from './file-browser/file-browser.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRoot(),
    InMemoryDBModule.forRoot(),

    ExperimentsModule,
    ExperimentResultsModule,
    FileBrowserModule,
    SequenceModule,
    LowLevelModule,
    CommandsModule
  ],
  controllers: []
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CorsMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
