import { Module } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { LowLevelModule } from '../low-level/low-level.module';
import { ExperimentsModule } from '../experiments/experiments.module';

@Module({
  controllers: [
    CommandsController
  ],
  imports: [
    LowLevelModule,
    ExperimentsModule
  ]
})
export class CommandsModule {

}
