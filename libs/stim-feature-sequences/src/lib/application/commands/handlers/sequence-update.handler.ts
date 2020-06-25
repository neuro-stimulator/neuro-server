import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { SequencesService } from '../../../domain/services/sequences.service';
import { QueryError } from '../../../domain/model/query-error';
import { SequenceWasNotUpdatedError } from '../../../domain/exception/sequence-was-not-updated.error';
import { SequenceWasUpdatedEvent } from '../../event/impl/sequence-was-updated.event';
import { SequenceUpdateCommand } from '../impl/sequence-update.command';

@CommandHandler(SequenceUpdateCommand)
export class SequenceUpdateHandler
  implements ICommandHandler<SequenceUpdateCommand, void> {
  constructor(
    private readonly service: SequencesService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: SequenceUpdateCommand): Promise<void> {
    try {
      await this.service.update(command.sequence);
      this.eventBus.publish(new SequenceWasUpdatedEvent(command.sequence));
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new SequenceWasNotUpdatedError(
          command.sequence,
          (e as unknown) as QueryError
        );
      }
      throw new SequenceWasNotUpdatedError(command.sequence);
    }
  }
}
