import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { Experiment, ExperimentResult } from '@stechy1/diplomka-share';

import { StimulatorFacade } from '@diplomka-backend/stim-feature-stimulator/infrastructure';
import { ExperimentsFacade } from '@diplomka-backend/stim-feature-experiments/infrastructure';

import { PlayerService } from '../../service/player.service';
import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(ExperimentResultInitializeCommand)
export class ExperimentResultInitializeHandler implements ICommandHandler<ExperimentResultInitializeCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentResultInitializeHandler.name);

  constructor(
    private readonly service: PlayerService,
    private readonly stimulatorFacade: StimulatorFacade,
    private readonly experimentsFacade: ExperimentsFacade,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: ExperimentResultInitializeCommand): Promise<void> {
    this.logger.debug('Budu inicializovat výsledek experimentu.');
    // Z ID získám úpnou instanci experimentu
    this.logger.debug('1. Získám instanci experimentu.');
    const experiment: Experiment = await this.experimentsFacade.experimentByID(command.experimentID);
    // Inicializuji nový výsledek experimentu
    this.logger.debug('2. Inicializuji výsledek experimentu.');
    const experimentResult: ExperimentResult = this.service.createEmptyExperimentResult(experiment);
    // Zvěřejním událost, že byl inicializován výsledek experimentu
    this.logger.debug('3. Zveřejňuji událost, že byl inicializován výsledek experimentu.');
    this.eventBus.publish(new ExperimentResultWasInitializedEvent(experimentResult));
  }
}
