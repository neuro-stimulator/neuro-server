import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { SequencesService } from '../../../domain/services/sequences.service';
import { QueryError } from '../../../domain/model/query-error';
import { SequenceWasNotCreatedError } from '../../../domain/exception';
import { SequenceWasCreatedEvent } from '../../event';
import { SequenceInsertCommand } from '../impl/sequence-insert.command';

@CommandHandler(SequenceInsertCommand)
export class SequenceInsertHandler
  implements ICommandHandler<SequenceInsertCommand, number> {
  constructor(
    private readonly service: SequencesService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: SequenceInsertCommand): Promise<number> {
    try {
      const id = await this.service.insert(command.sequence);
      this.eventBus.publish(new SequenceWasCreatedEvent(id));
      return id;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new SequenceWasNotCreatedError(
          command.sequence,
          (e as unknown) as QueryError
        );
      }
      throw new SequenceWasNotCreatedError(command.sequence);
    }
  }
}
