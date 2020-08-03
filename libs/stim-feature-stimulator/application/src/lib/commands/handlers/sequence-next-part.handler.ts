import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';

import { ExperimentERP } from '@stechy1/diplomka-share';
import { ExperimentByIdQuery } from '@diplomka-backend/stim-feature-experiments/application';

import { StimulatorService } from '../../service/stimulator.service';
import { CommandIdService } from '../../service/command-id.service';
import { SequenceNextPartCommand } from '../impl/sequence-next-part.command';

@CommandHandler(SequenceNextPartCommand)
export class SequenceNextPartHandler implements ICommandHandler<SequenceNextPartCommand, void> {
  private readonly logger: Logger = new Logger(SequenceNextPartHandler.name);
  constructor(private readonly service: StimulatorService, private readonly commandIdService: CommandIdService, private readonly queryBus: QueryBus) {}

  async execute(command: SequenceNextPartCommand): Promise<void> {
    // const experimentId = this._experimentResults.activeExperimentResult
    //   .experimentID;
    const experiment: ExperimentERP = (await this.queryBus.execute(new ExperimentByIdQuery(this.service.currentExperimentID))) as ExperimentERP;
    this.logger.debug(`Budu nahrávat část sekvence s ID: ${experiment.sequenceId}. offset=${command.offset}, index=${command.index}`);
    // const sequence: Sequence = await this._sequences.byId(
    //   experiment.sequenceId
    // );
    // this._serial.write(
    //   buffers.bufferCommandNEXT_SEQUENCE_PART(sequence, offset, index)
    // );
  }
}
