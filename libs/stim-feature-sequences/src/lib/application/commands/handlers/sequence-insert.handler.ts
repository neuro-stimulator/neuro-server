import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { QueryFailedError } from 'typeorm';

import { SequenceNotValidException } from '../../../domain/exception/sequence-not-valid.exception';
import { SequencesService } from '../../../domain/services/sequences.service';
import { QueryError } from '../../../domain/model/query-error';
import { SequenceWasNotCreatedError } from '../../../domain/exception/sequence-was-not-created.error';
import { SequenceWasCreatedEvent } from '../../event/impl/sequence-was-created.event';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';
import { SequenceInsertCommand } from '../impl/sequence-insert.command';

@CommandHandler(SequenceInsertCommand)
export class SequenceInsertHandler implements ICommandHandler<SequenceInsertCommand, number> {
  private readonly logger: Logger = new Logger(SequenceInsertHandler.name);

  constructor(private readonly service: SequencesService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: SequenceInsertCommand): Promise<number> {
    this.logger.debug('Budu vkládat novou sekvenci do databáze.');
    // this.logger.debug('1. Zvaliduji vkládanou sekvenci.');
    // await this.commandBus.execute(new SequenceValidateCommand(command.sequence));
    try {
      this.logger.debug('2. Budu vkládat validní sekvenci do databáze.');
      const id = await this.service.insert(command.sequence);
      this.eventBus.publish(new SequenceWasCreatedEvent(id));
      return id;
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        throw new SequenceNotValidException(e.sequence);
      } else if (e instanceof QueryFailedError) {
        throw new SequenceWasNotCreatedError(command.sequence, (e as unknown) as QueryError);
      }
      throw new SequenceWasNotCreatedError(command.sequence);
    }
  }
}
