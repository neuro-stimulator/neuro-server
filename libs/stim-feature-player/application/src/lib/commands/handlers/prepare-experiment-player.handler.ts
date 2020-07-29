import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentEndConditionFactory } from '@diplomka-backend/stim-feature-player/domain';

import { PrepareExperimentPlayerCommand } from '../impl/prepare-experiment-player.command';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(PrepareExperimentPlayerCommand)
export class PrepareExperimentPlayerHandler implements ICommandHandler<PrepareExperimentPlayerCommand, void> {
  private readonly logger: Logger = new Logger(PrepareExperimentPlayerHandler.name);

  constructor(private readonly commandBus: CommandBus, private readonly experimentEndConditionFactory: ExperimentEndConditionFactory) {}

  async execute(command: PrepareExperimentPlayerCommand): Promise<void> {
    this.logger.debug('Budu připravovat prostředí pro přehrávač experimentu.');

    const experimentEndCondition = this.experimentEndConditionFactory.createCondition(command.conditionType, command.playerConfiguration.stopConditions);
    await this.commandBus.execute(
      new ExperimentResultInitializeCommand(command.experimentID, experimentEndCondition, command.playerConfiguration.repeat, command.playerConfiguration.betweenExperimentInterval)
    );
  }
}
