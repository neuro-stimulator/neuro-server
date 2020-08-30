import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandFromStimulator, Experiment, Sequence, ExperimentSupportSequences } from '@stechy1/diplomka-share';

import { ExperimentByIdQuery } from '@diplomka-backend/stim-feature-experiments/application';
import { SequenceByIdQuery } from '@diplomka-backend/stim-feature-sequences/application';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentUploadCommand } from '../impl/experiment-upload.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentUploadCommand)
export class ExperimentUploadHandler extends BaseStimulatorBlockingHandler<ExperimentUploadCommand> {
  constructor(private readonly service: StimulatorService, commandIdService: CommandIdService, eventBus: EventBus, private readonly queryBus: QueryBus) {
    super(eventBus, commandIdService, new Logger(ExperimentUploadHandler.name));
  }

  protected init() {
    this.logger.debug('Budu nahrávat experiment.');
  }

  protected done() {
    this.logger.debug('Experiment byl nahrán.');
    this.service.lastKnownStimulatorState = CommandFromStimulator.COMMAND_STIMULATOR_STATE_UPLOADED;
  }

  async callServiceMethod(command: ExperimentUploadCommand, commandID: number) {
    // Získám experiment z databáze
    const experiment: Experiment = await this.queryBus.execute(new ExperimentByIdQuery(command.experimentID, command.userID));
    this.logger.debug(`Experiment je typu: ${experiment.type}`);
    let sequence: Sequence;
    // Pokud experiment podporuje sekvence
    if (experiment.supportSequences) {
      this.logger.debug('Experiment podporuje sekvence.');
      sequence = await this.queryBus.execute(new SequenceByIdQuery(((experiment as unknown) as ExperimentSupportSequences).sequenceId, command.userID));
      // TODO upozornit uživatele, že není co přehrávat
      if (!sequence) {
        this.logger.error('Sekvence nebyla nalezena! Je možné, že experiment se nebude moct nahrát.');
      }
    }
    // Provedu serilizaci a odeslání příkazu
    this.service.uploadExperiment(commandID, experiment, sequence);
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
