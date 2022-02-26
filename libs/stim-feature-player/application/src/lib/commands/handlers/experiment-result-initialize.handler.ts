import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { createEmptySequence, Experiment, ExperimentResult, ExperimentSupportSequences, Output, OutputDependency, OutputForSequence, Sequence } from '@stechy1/diplomka-share';

import { ExperimentByIdQuery } from '@neuro-server/stim-feature-experiments/application';
import { SequenceByIdQuery, SequenceGenerateCommand } from '@neuro-server/stim-feature-sequences/application';
import { SequenceIdNotFoundException } from '@neuro-server/stim-feature-sequences/domain';

import { ExperimentResultWasInitializedEvent } from '../../event/impl/experiment-result-was-initialized.event';
import { PlayerService } from '../../service/player.service';
import { ExperimentResultInitializeCommand } from '../impl/experiment-result-initialize.command';

@CommandHandler(ExperimentResultInitializeCommand)
export class ExperimentResultInitializeHandler implements ICommandHandler<ExperimentResultInitializeCommand, ExperimentResult> {
  private readonly logger: Logger = new Logger(ExperimentResultInitializeHandler.name);

  constructor(private readonly service: PlayerService, private readonly queryBus: QueryBus, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: ExperimentResultInitializeCommand): Promise<ExperimentResult> {
    this.logger.debug('Budu inicializovat výsledek experimentu.');
    // Z ID získám úpnou instanci experimentu
    this.logger.debug('1. Získám instanci experimentu.');
    const experiment: Experiment<Output> = await this.queryBus.execute(new ExperimentByIdQuery(command.userGroups, command.experimentID));
    let sequence = null;
    if (experiment.supportSequences) {
      this.logger.debug('Experiment podporuje sekvence. Budu načítat také sekvenci experimentu.');
      try {
        sequence = await this.queryBus.execute(new SequenceByIdQuery(
          command.userGroups,
          (experiment as ExperimentSupportSequences<OutputForSequence<OutputDependency>, OutputDependency>).sequenceId)
        );
      } catch (e) {
        if (e instanceof SequenceIdNotFoundException) {
          this.logger.error('Sekvence experimentu nebyla nalezena!');
          const sequenceData: number[] = await this.commandBus.execute<SequenceGenerateCommand, number[]>(new SequenceGenerateCommand(
            command.userGroups,
            experiment.id,
            (experiment as ExperimentSupportSequences<OutputForSequence<OutputDependency>, OutputDependency>).defaultSequenceSize));
          sequence = this.createEmptySequence(experiment as ExperimentSupportSequences<OutputForSequence<OutputDependency>, OutputDependency>, sequenceData);
        } else {
          throw e;
        }
      }
    }
    // Inicializuji nový výsledek experimentu
    this.logger.debug('2. Inicializuji výsledek experimentu.');
    const experimentResult: ExperimentResult = this.service.createEmptyExperimentResult(
      command.userId,
      command.userGroups,
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

  protected createEmptySequence(experiment: ExperimentSupportSequences<OutputForSequence<OutputDependency>, OutputDependency>, data: number[]): Sequence {
    const sequence: Sequence = createEmptySequence();
    sequence.size = experiment.defaultSequenceSize;
    sequence.data = data;

    return sequence;
  }
}
