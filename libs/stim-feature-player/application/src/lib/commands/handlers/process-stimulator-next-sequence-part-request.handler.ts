import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SequenceNextPartCommand } from '@diplomka-backend/stim-feature-stimulator/application';

import { PlayerService } from '../../service/player.service';
import { ProcessStimulatorNextSequencePartRequestCommand } from '../impl/process-stimulator-next-sequence-part-request.command';

@CommandHandler(ProcessStimulatorNextSequencePartRequestCommand)
export class ProcessStimulatorNextSequencePartRequestHandler implements ICommandHandler<ProcessStimulatorNextSequencePartRequestCommand, void> {

  private readonly logger: Logger = new Logger(ProcessStimulatorNextSequencePartRequestHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async execute(command: ProcessStimulatorNextSequencePartRequestCommand): Promise<any> {
    return this.commandBus.execute(new SequenceNextPartCommand(this.service.sequence, command.offset, command.index));
  }

}
