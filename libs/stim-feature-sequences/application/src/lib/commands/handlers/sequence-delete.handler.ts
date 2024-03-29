import { QueryFailedError } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceIdNotFoundException, SequenceWasNotDeletedException } from '@neuro-server/stim-feature-sequences/domain';
import { QueryError } from '@neuro-server/stim-lib-common';

import { SequenceWasDeletedEvent } from '../../event/impl/sequence-was-deleted.event';
import { SequencesService } from '../../services/sequences.service';
import { SequenceDeleteCommand } from '../impl/sequence-delete.command';

@CommandHandler(SequenceDeleteCommand)
export class SequenceDeleteHandler implements ICommandHandler<SequenceDeleteCommand, void> {
  private readonly logger: Logger = new Logger(SequenceDeleteHandler.name);

  constructor(private readonly service: SequencesService, private readonly eventBus: EventBus) {}

  async execute(command: SequenceDeleteCommand): Promise<void> {
    this.logger.debug('Budu mazat sekvenci.');
    try {
      // Získám instanci sekvence
      const sequence: Sequence = await this.service.byId(command.userGroups, command.sequenceID);
      // Nechám smazat sekvenci
      await this.service.delete(command.sequenceID);
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
