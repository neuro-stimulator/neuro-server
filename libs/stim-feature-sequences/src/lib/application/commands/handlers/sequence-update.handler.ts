import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { SequencesService } from '../../../domain/services/sequences.service';
import { QueryError } from '../../../domain/model/query-error';
import { SequenceWasNotUpdatedError } from '../../../domain/exception/sequence-was-not-updated.error';
import { SequenceIdNotFoundError } from '../../../domain/exception/sequence-id-not-found.error';
import { SequenceWasUpdatedEvent } from '../../event/impl/sequence-was-updated.event';
import { SequenceNotValidException } from '../../../domain/exception/sequence-not-valid.exception';
import { SequenceUpdateCommand } from '../impl/sequence-update.command';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';

@CommandHandler(SequenceUpdateCommand)
export class SequenceUpdateHandler implements ICommandHandler<SequenceUpdateCommand, void> {
  private readonly logger: Logger = new Logger(SequenceUpdateHandler.name);

  constructor(private readonly service: SequencesService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: SequenceUpdateCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat sekvenci.');
    this.logger.debug('1. Zvaliduji aktualizovanou sekvenci.');
    await this.commandBus.execute(new SequenceValidateCommand(command.sequence));
    try {
      this.logger.debug('2. Budu aktualizovat validní sekvenci.');
      await this.service.update(command.sequence);
      this.eventBus.publish(new SequenceWasUpdatedEvent(command.sequence));
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        throw new SequenceNotValidException(e.sequence);
      } else if (e instanceof SequenceIdNotFoundError) {
        throw new SequenceIdNotFoundError(e.sequenceID);
      } else if (e instanceof QueryFailedError) {
        throw new SequenceWasNotUpdatedError(command.sequence, (e as unknown) as QueryError);
      }
      throw new SequenceWasNotUpdatedError(command.sequence);
    }
  }
}
