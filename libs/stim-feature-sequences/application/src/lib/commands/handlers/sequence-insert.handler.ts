import { QueryFailedError } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { SequenceNotValidException, SequenceWasNotCreatedException } from '@neuro-server/stim-feature-sequences/domain';
import { QueryError } from '@neuro-server/stim-lib-common';

import { SequenceWasCreatedEvent } from '../../event/impl/sequence-was-created.event';
import { SequencesService } from '../../services/sequences.service';
import { SequenceInsertCommand } from '../impl/sequence-insert.command';
import { SequenceValidateCommand } from '../impl/sequence-validate.command';

@CommandHandler(SequenceInsertCommand)
export class SequenceInsertHandler implements ICommandHandler<SequenceInsertCommand, number> {
  private readonly logger: Logger = new Logger(SequenceInsertHandler.name);

  constructor(private readonly service: SequencesService, private readonly commandBus: CommandBus, private readonly eventBus: EventBus) {}

  async execute(command: SequenceInsertCommand): Promise<number> {
    this.logger.debug('Budu vkládat novou sekvenci do databáze.');
    this.logger.debug('1. Zvaliduji vkládanou sekvenci.');
    try {
      await this.commandBus.execute(new SequenceValidateCommand(command.sequence));
      this.logger.debug('2. Budu vkládat validní sekvenci do databáze.');
      const id = await this.service.insert(command.sequence, command.userID);
      this.eventBus.publish(new SequenceWasCreatedEvent(id));
      return id;
    } catch (e) {
      if (e instanceof SequenceNotValidException) {
        throw e;
      } else if (e instanceof QueryFailedError) {
        throw new SequenceWasNotCreatedException(command.sequence, (e as unknown) as QueryError);
      }
      throw new SequenceWasNotCreatedException(command.sequence);
    }
  }
}
