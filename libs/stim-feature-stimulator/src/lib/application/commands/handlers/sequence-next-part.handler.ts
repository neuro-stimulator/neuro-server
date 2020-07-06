import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ExperimentERP } from '@stechy1/diplomka-share';

import { ExperimentsFacade } from '@diplomka-backend/stim-feature-experiments/infrastructure';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { CommandIdService } from '../../../domain/service/command-id.service';
import { SequenceNextPartCommand } from '../impl/sequence-next-part.command';

@CommandHandler(SequenceNextPartCommand)
export class SequenceNextPartHandler implements ICommandHandler<SequenceNextPartCommand, void> {
  private readonly logger: Logger = new Logger(SequenceNextPartHandler.name);
  constructor(private readonly service: StimulatorService, private readonly commandIdService: CommandIdService, private readonly experimentsFacade: ExperimentsFacade) {}

  async execute(command: SequenceNextPartCommand): Promise<void> {
    // const experimentId = this._experimentResults.activeExperimentResult
    //   .experimentID;
    const experiment: ExperimentERP = (await this.experimentsFacade.experimentByID(this.service.currentExperimentID)) as ExperimentERP;
    this.logger.debug(`Budu nahrávat část sekvence s ID: ${experiment.sequenceId}. offset=${command.offset}, index=${command.index}`);
    // const sequence: Sequence = await this._sequences.byId(
    //   experiment.sequenceId
    // );
    // this._serial.write(
    //   buffers.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index)
    // );
  }
}
