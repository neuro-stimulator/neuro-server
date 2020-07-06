import { EventBus, ICommandHandler, QueryHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceIdNotFoundError } from '@diplomka-backend/stim-feature-sequences/domain';
import { QueryError } from '@diplomka-backend/stim-feature-sequences/domain';
import { SequenceWasNotDeletedError } from '@diplomka-backend/stim-feature-sequences/domain';

import { SequencesService } from '../../services/sequences.service';
import { SequenceWasDeletedEvent } from '../../event/impl/sequence-was-deleted.event';
import { SequenceDeleteCommand } from '../impl/sequence-delete.command';

@QueryHandler(SequenceDeleteCommand)
export class SequenceDeleteHandler implements ICommandHandler<SequenceDeleteCommand, void> {
  constructor(private readonly service: SequencesService, private readonly eventBus: EventBus) {}

  async execute(command: SequenceDeleteCommand): Promise<void> {
    try {
      const sequence: Sequence = await this.service.byId(command.sequenceID);
      await this.service.delete(command.sequenceID);
      this.eventBus.publish(new SequenceWasDeletedEvent(sequence));
    } catch (e) {
      if (e instanceof SequenceIdNotFoundError) {
        throw new SequenceIdNotFoundError(e.sequenceID);
      } else if (e instanceof QueryFailedError) {
        throw new SequenceWasNotDeletedError(command.sequenceID, (e as unknown) as QueryError);
      }
      throw new SequenceWasNotDeletedError(command.sequenceID);
    }
  }
}
