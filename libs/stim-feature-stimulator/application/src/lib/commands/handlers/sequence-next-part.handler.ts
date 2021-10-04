import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';

import { CommandIdService } from '@diplomka-backend/stim-lib-common';

import { StimulatorEvent } from '../../events/impl/stimulator.event';
import { StimulatorService } from '../../service/stimulator.service';
import { SequenceNextPartCommand } from '../impl/sequence-next-part.command';
import { BaseStimulatorBlockingHandler } from './base/base-stimulator-blocking.handler';

@CommandHandler(SequenceNextPartCommand)
export class SequenceNextPartHandler extends BaseStimulatorBlockingHandler<SequenceNextPartCommand> {

  constructor(private readonly service: StimulatorService, queryBus: QueryBus, commandIdService: CommandIdService, eventBus: EventBus) {
    super(queryBus, commandIdService, eventBus, new Logger(SequenceNextPartHandler.name));
  }

  protected async callServiceMethod(command: SequenceNextPartCommand, commandID: number): Promise<void> {
    this.service.sendNextSequencePart(command.sequence, command.offset, command.index, commandID);
  }

  protected isValid(event: StimulatorEvent): boolean {
    return false;
  }

  protected done(event: StimulatorEvent): void {
    this.logger.debug('Další část sekvence byla úspěšně nahrána.');
  }
}
