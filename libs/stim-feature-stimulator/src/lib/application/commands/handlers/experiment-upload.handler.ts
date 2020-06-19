import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  Experiment,
  ExperimentERP,
  ExperimentType,
  Sequence,
} from '@stechy1/diplomka-share';

import { ExperimentsFacade } from '@diplomka-backend/stim-feature-experiments';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { ExperimentUploadCommand } from '../impl/experiment-upload.command';

@CommandHandler(ExperimentUploadCommand)
export class ExperimentUploadHandler
  implements ICommandHandler<ExperimentUploadCommand, void> {
  private readonly logger: Logger = new Logger(ExperimentUploadHandler.name);

  constructor(
    private readonly service: StimulatorService,
    private readonly experimentsFacade: ExperimentsFacade
  ) {}

  async execute(command: ExperimentUploadCommand): Promise<void> {
    this.logger.debug(`Budu nahrávat experiment s ID: ${command.experimentID}.`);
    // Získám experiment z databáze
    const experiment: Experiment = await this.experimentsFacade.experimentByID(
      command.experimentID
    );
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
        this.logger.error(
          'Sekvence nebyla nalezena! Je možné, že experiment se nebude moct nahrát.'
        );
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
    this.service.uploadExperiment(experiment, sequence);
  }
}
