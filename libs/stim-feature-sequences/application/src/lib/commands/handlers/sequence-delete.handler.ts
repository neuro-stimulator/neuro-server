import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { Sequence } from '@stechy1/diplomka-share';

import { QueryError } from '@diplomka-backend/stim-lib-common';
import { SequenceIdNotFoundException } from '@diplomka-backend/stim-feature-sequences/domain';
import { SequenceWasNotDeletedException } from '@diplomka-backend/stim-feature-sequences/domain';

import { SequencesService } from '../../services/sequences.service';
import { SequenceWasDeletedEvent } from '../../event/impl/sequence-was-deleted.event';
import { SequenceDeleteCommand } from '../impl/sequence-delete.command';

@CommandHandler(SequenceDeleteCommand)
export class SequenceDeleteHandler implements ICommandHandler<SequenceDeleteCommand, void> {
  private readonly logger: Logger = new Logger(SequenceDeleteHandler.name);

  constructor(private readonly service: SequencesService, private readonly eventBus: EventBus) {}

  async execute(command: SequenceDeleteCommand): Promise<void> {
    this.logger.debug('Budu mazat sekvenci.');
    try {
      // Získám instanci sekvence
      const sequence: Sequence = await this.service.byId(command.sequenceID, command.userID);
      // Nechám smazat sekvenci
      await this.service.delete(command.sequenceID, command.userID);
      // Publikuji událost, že sekvence byla smazána
      this.eventBus.publish(new SequenceWasDeletedEvent(sequence));
    } catch (e) {
      if (e instanceof SequenceIdNotFoundException) {
        throw new SequenceIdNotFoundException(e.sequenceID);
      } else if (e instanceof QueryFailedError) {
        throw new SequenceWasNotDeletedException(command.sequenceID, (e as unknown) as QueryError);
      }
      throw new SequenceWasNotDeletedException(command.sequenceID);
    }
  }
}
