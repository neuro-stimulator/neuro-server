import { Module } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { CommandsGateway } from './commands.gateway';

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
export class CommandsModule {

}
