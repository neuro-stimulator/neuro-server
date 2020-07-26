import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PrepareExperimentPlayerCommand } from '../impl/prepare-experiment-player.command';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(PrepareExperimentPlayerCommand)
export class PrepareExperimentPlayerHandler implements ICommandHandler<PrepareExperimentPlayerCommand, void> {
  private readonly logger: Logger = new Logger(PrepareExperimentPlayerHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: PrepareExperimentPlayerCommand): Promise<void> {
    this.logger.debug('Budu připravovat prostředí pro přehrávač experimentu.');

    await this.commandBus.execute(new ExperimentResultInitializeCommand(command.experimentID));
  }
}
