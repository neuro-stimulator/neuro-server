import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// import { LowLevelModule } from '../low-level/low-level.module';
// import { ExperimentsModule } from '../experiments/experiments.module';
// import { SequencesModule } from '../sequences/sequences.module';
// import { IpcModule } from '../ipc/ipc.module';
// import { CommandsGateway } from './commands.gateway';
// import { ExperimentMiddleware } from './middleware/experiment.middleware';
// import { CommandsController } from './commands.controller';
// import { CommandsService } from './commands.service';
// import { ExperimentResultsModule } from '../experiment-results/experiment-results.module';

// @Module({
//   controllers: [
//     CommandsController
//   ],
//   imports: [
//     LowLevelModule,
//     ExperimentsModule,
//     ExperimentResultsModule,
//     SequencesModule,
//     IpcModule
//   ],
//   providers: [
//     CommandsService,
//     CommandsGateway
//   ]
// })
export class CommandsModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(ExperimentMiddleware)
  //     .forRoutes('/api/commands/experiment/*');
  // }
}
