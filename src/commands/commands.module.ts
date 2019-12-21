import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { CommandsGateway } from './commands.gateway';
import { experimentMiddleware } from './middleware/experiment.middleware';

@Module({
  controllers: [
    CommandsController
  ],
  imports: [
    LowLevelModule,
    ExperimentsModule
  ],
  providers: [
    CommandsGateway
  ]
})
export class CommandsModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(experimentMiddleware)
    .forRoutes('/api/command/experiment');
  }

}
