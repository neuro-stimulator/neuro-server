import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { Experiment, ExperimentResult } from '@stechy1/diplomka-share';

import { ExperimentByIdQuery } from '@diplomka-backend/stim-feature-experiments/application';

import { PlayerService } from '../../service/player.service';
import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(ExperimentResultInitializeCommand)
export class ExperimentResultInitializeHandler implements ICommandHandler<ExperimentResultInitializeCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentResultInitializeHandler.name);

  constructor(private readonly service: PlayerService, private readonly queryBus: QueryBus, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultInitializeCommand): Promise<void> {
    this.logger.debug('Budu inicializovat výsledek experimentu.');
    // Z ID získám úpnou instanci experimentu
    this.logger.debug('1. Získám instanci experimentu.');
    const experiment: Experiment = await this.queryBus.execute(new ExperimentByIdQuery(command.experimentID));
    // Inicializuji nový výsledek experimentu
    this.logger.debug('2. Inicializuji výsledek experimentu.');
    const experimentResult: ExperimentResult = this.service.createEmptyExperimentResult(
      experiment,
      command.experimentStopCondition,
      command.experimentRepeat,
      command.betweenExperimentInterval,
      command.autoplay
    );
    // Zvěřejním událost, že byl inicializován výsledek experimentu
    this.logger.debug('3. Zveřejňuji událost, že byl inicializován výsledek experimentu.');
    this.eventBus.publish(new ExperimentResultWasInitializedEvent(experimentResult));
  }
}
