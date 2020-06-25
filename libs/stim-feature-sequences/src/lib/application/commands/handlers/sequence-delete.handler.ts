import { EventBus, ICommandHandler, QueryHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { Sequence } from '@stechy1/diplomka-share';

import { SequencesService } from '../../../domain/services/sequences.service';
import { QueryError } from '../../../domain/model/query-error';
import { SequenceWasNotDeletedError } from '../../../domain/exception/sequence-was-not-deleted.error';
import { SequenceWasDeletedEvent } from '../../event/impl/sequence-was-deleted.event';
import { SequenceDeleteCommand } from '../impl/sequence-delete.command';

@QueryHandler(SequenceDeleteCommand)
export class SequenceDeleteHandler
  implements ICommandHandler<SequenceDeleteCommand, void> {
  constructor(
    private readonly service: SequencesService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: SequenceDeleteCommand): Promise<void> {
    try {
      const sequence: Sequence = await this.service.byId(command.sequenceID);
      await this.service.delete(command.sequenceID);
      this.eventBus.publish(new SequenceWasDeletedEvent(sequence));
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new SequenceWasNotDeletedError(
          command.sequenceID,
          (e as unknown) as QueryError
        );
      }
      throw new SequenceWasNotDeletedError(command.sequenceID);
    }
  }
}
