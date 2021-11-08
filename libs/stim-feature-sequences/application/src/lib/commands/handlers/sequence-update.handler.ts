import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { QueryError } from '@neuro-server/stim-lib-common';
import { SequenceWasNotUpdatedException, SequenceIdNotFoundException, SequenceNotValidException } from '@neuro-server/stim-feature-sequences/domain';

import { SequencesService } from '../../services/sequences.service';
import { SequenceWasUpdatedEvent } from '../../event/impl/sequence-was-updated.event';
import { SequenceUpdateCommand } from '../impl/sequence-update.command';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';

@CommandHandler(SequenceUpdateCommand)
export class SequenceUpdateHandler implements ICommandHandler<SequenceUpdateCommand, void> {
  private readonly logger: Logger = new Logger(SequenceUpdateHandler.name);

  constructor(private readonly service: SequencesService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: SequenceUpdateCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat sekvenci.');
    this.logger.debug('1. Zvaliduji aktualizovanou sekvenci.');
    try {
      await this.commandBus.execute(new SequenceValidateCommand(command.sequence));
      this.logger.debug('2. Budu aktualizovat validní sekvenci.');
      await this.service.update(command.userGroups, command.sequence);
      this.eventBus.publish(new SequenceWasUpdatedEvent(command.sequence));
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        throw e;
      } else if (e instanceof SequenceIdNotFoundException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new SequenceWasNotUpdatedException(command.sequence, (e as unknown) as QueryError);
      }
      throw new SequenceWasNotUpdatedException(command.sequence);
    }
  }
}
