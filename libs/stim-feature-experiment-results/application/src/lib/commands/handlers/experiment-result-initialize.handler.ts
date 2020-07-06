import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { Experiment, ExperimentResult } from '@stechy1/diplomka-share';

import { StimulatorFacade } from '@diplomka-backend/stim-feature-stimulator/infrastructure';
import { ExperimentsFacade } from '@diplomka-backend/stim-feature-experiments/infrastructure';

import { ExperimentResultsService } from '../../services/experiment-results.service';
import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(ExperimentResultInitializeCommand)
export class ExperimentResultInitializeHandler implements ICommandHandler<ExperimentResultInitializeCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentResultInitializeHandler.name);

  constructor(
    private readonly service: ExperimentResultsService,
    private readonly stimulatorFacade: StimulatorFacade,
    private readonly experimentsFacade: ExperimentsFacade,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: ExperimentResultInitializeCommand): Promise<void> {
    this.logger.debug('Budu inicializovat výsledek experimentu.');
    // Získám ID aktuálně nahraného experimentu
    this.logger.debug('1. Získám ID aktuálně nahraného experimentu.');
    const experimentID = await this.stimulatorFacade.getCurrentExperimentID();
    this.logger.debug(`{experimentID=${experimentID}}`);
    // Z ID získám úpnou instanci experimentu
    this.logger.debug('2. Získám instanci experimentu.');
    const experiment: Experiment = await this.experimentsFacade.experimentByID(experimentID);
    // Inicializuji nový výsledek experimentu
    // try {
    this.logger.debug('3. Inicializuji výsledek experimentu.');
    const experimentResult: ExperimentResult = this.service.createEmptyExperimentResult(experiment);
    // Zvěřejním událost, že byl inicializován výsledek experimentu
    this.logger.debug('4. Zveřejňuji událost, že byl inicializován výsledek experimentu.');
    this.eventBus.publish(new ExperimentResultWasInitializedEvent(command.timestamp, experimentResult));
    // } catch (e) {
    //   if (e instanceof QueryFailedError) {
    //     throw new ExperimentResultWasNotInitializedError(experimentID, (e as unknown) as QueryError);
    //   }
    //   throw new ExperimentResultWasNotInitializedError(experimentID);
    // }
  }
}
