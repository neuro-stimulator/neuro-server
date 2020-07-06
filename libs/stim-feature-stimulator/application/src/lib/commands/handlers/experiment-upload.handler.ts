import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';

import { Experiment, ExperimentType, Sequence } from '@stechy1/diplomka-share';

import { ExperimentsFacade } from '@diplomka-backend/stim-feature-experiments/infrastructure';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { ExperimentUploadCommand } from '../impl/experiment-upload.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(ExperimentUploadCommand)
export class ExperimentUploadHandler extends BaseStimulatorBlockingHandler<ExperimentUploadCommand> {
  constructor(private readonly service: StimulatorService, private readonly experimentsFacade: ExperimentsFacade, commandIdService: CommandIdService, eventBus: EventBus) {
    super(eventBus, commandIdService, new Logger(ExperimentUploadHandler.name));
  }

  protected init() {
    this.logger.debug(`Budu nahrávat experiment.`);
  }

  protected done() {
    this.logger.debug('Experiment byl nahrán.');
  }

  async callServiceMethod(command: ExperimentUploadCommand, commandID: number) {
    // Získám experiment z databáze
    const experiment: Experiment = await this.experimentsFacade.experimentByID(command.experimentID);
    // tslint:disable-next-line:prefer-const
    let sequence: Sequence;
    // Pokud se jedná o typ ERP, vytáhnu si ještě sekvenci
    if (experiment.type === ExperimentType.ERP) {
      // sequence = await this._sequences.byId(
      //   (experiment as ExperimentERP).sequenceId
      // );
      // Pokud není sekvence nalezena, tak to zaloguji
      // TODO upozornit uživatele, že není co přehrávat
      if (!sequence) {
        this.logger.error('Sekvence nebyla nalezena! Je možné, že experiment se nebude moct nahrát.');
      }
    }
    this.logger.debug(`Experiment je typu: ${experiment.type}`);
    // Odešlu přes IPC informaci, že nahrávám experiment na stimulátor
    // this._ipc.send(TOPIC_EXPERIMENT_STATUS, {
    //   status: 'upload',
    //   id,
    //   outputCount: experiment.outputCount,
    // });
    // Provedu serilizaci a odeslání příkazu
    this.service.uploadExperiment(commandID, experiment, sequence);
  }

  protected isValid(event: StimulatorEvent) {
    return event.data.name === StimulatorStateData.name;
  }
}
