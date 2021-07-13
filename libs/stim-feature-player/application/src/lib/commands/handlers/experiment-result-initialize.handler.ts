import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { Experiment, ExperimentResult, ExperimentSupportSequences, Output, OutputDependency, OutputForSequence } from '@stechy1/diplomka-share';

import { ExperimentByIdQuery } from '@diplomka-backend/stim-feature-experiments/application';
import { SequenceByIdQuery } from '@diplomka-backend/stim-feature-sequences/application';
import { SequenceIdNotFoundException } from '@diplomka-backend/stim-feature-sequences/domain';

import { PlayerService } from '../../service/player.service';
import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(ExperimentResultInitializeCommand)
export class ExperimentResultInitializeHandler implements ICommandHandler<ExperimentResultInitializeCommand, ExperimentResult> {
  private readonly logger: Logger = new Logger(ExperimentResultInitializeHandler.name);

  constructor(private readonly service: PlayerService, private readonly queryBus: QueryBus, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultInitializeCommand): Promise<ExperimentResult> {
    this.logger.debug('Budu inicializovat výsledek experimentu.');
    // Z ID získám úpnou instanci experimentu
    this.logger.debug('1. Získám instanci experimentu.');
    const experiment: Experiment<Output> = await this.queryBus.execute(new ExperimentByIdQuery(command.experimentID, command.userID));
    let sequence = null;
    if (experiment.supportSequences) {
      this.logger.debug('Experiment podporuje sekvence. Budu načítat také sekvenci experimentu');
      try {
        sequence = await this.queryBus.execute(new SequenceByIdQuery(
          (experiment as ExperimentSupportSequences<OutputForSequence<OutputDependency>, OutputDependency>).sequenceId,
          command.userID)
        );
      } catch (e) {
        if (e instanceof SequenceIdNotFoundException) {
          this.logger.error('Sekvence experimentu nebyla nalezena!');
          // TODO vygenerovat sekvenci za běhu
        } else {
          throw e;
        }
      }
    }
    // Inicializuji nový výsledek experimentu
    this.logger.debug('2. Inicializuji výsledek experimentu.');
    const experimentResult: ExperimentResult = this.service.createEmptyExperimentResult(
      command.userID,
      experiment,
      sequence,
      command.experimentStopCondition,
      command.experimentRepeat,
      command.betweenExperimentInterval,
      command.autoplay,
    );
    // Zvěřejním událost, že byl inicializován výsledek experimentu
    this.logger.debug('3. Zveřejňuji událost, že byl inicializován výsledek experimentu.');
    this.eventBus.publish(new ExperimentResultWasInitializedEvent(experimentResult));

    return experimentResult
  }
}
