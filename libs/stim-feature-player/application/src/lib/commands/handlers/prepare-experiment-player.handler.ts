import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentStopCondition, ExperimentStopConditionFactory } from '@neuro-server/stim-feature-player/domain';

import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';
import { PrepareExperimentPlayerCommand } from '../impl/prepare-experiment-player.command';

@CommandHandler(PrepareExperimentPlayerCommand)
export class PrepareExperimentPlayerHandler implements ICommandHandler<PrepareExperimentPlayerCommand, void> {
  private readonly logger: Logger = new Logger(PrepareExperimentPlayerHandler.name);

  constructor(private readonly commandBus: CommandBus, private readonly experimentStopConditionFactory: ExperimentStopConditionFactory) {}

  async execute(command: PrepareExperimentPlayerCommand): Promise<void> {
    this.logger.debug('Budu připravovat prostředí pro přehrávač experimentu.');

    const experimentStopCondition: ExperimentStopCondition = this.experimentStopConditionFactory.createCondition(
      command.playerConfiguration.stopConditionType,
      command.playerConfiguration.stopConditions
    );
    return this.commandBus.execute(
      new ExperimentResultInitializeCommand(
        command.userID,
        command.userGroups,
        command.experimentID,
        experimentStopCondition,
        command.playerConfiguration.repeat,
        command.playerConfiguration.betweenExperimentInterval,
        command.playerConfiguration.autoplay
      )
    );
  }
}
