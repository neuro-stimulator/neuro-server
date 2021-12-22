import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueryFailedError } from 'typeorm';

import { QueryError } from '@neuro-server/stim-lib-common';
import { AclNotCreatedException } from '@neuro-server/stim-feature-acl/domain';

import { AclService } from '../../service/acl.service';
import { AclWasCreatedEvent } from '../../event/impl/acl-was-created.event';
import { AclInsertCommand } from '../impl/acl-insert.command';

@CommandHandler(AclInsertCommand)
export class AclInsertHandler implements ICommandHandler<AclInsertCommand, number> {

  private readonly logger: Logger = new Logger(AclInsertHandler.name);

  constructor(private readonly service: AclService, private readonly eventBus: EventBus) {}

  async execute(command: AclInsertCommand): Promise<number> {
    this.logger.debug('Budu vkládat nový ACL záznam do databáze.');
    this.logger.verbose(command.acl);
    try {
      const id = await this.service.insert(command.acl);
      this.eventBus.publish(new AclWasCreatedEvent(id));
      return id;
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new AclNotCreatedException(command.acl, (e as unknown) as QueryError);
      }
      this.logger.error(e.message);
      throw new AclNotCreatedException(command.acl);
    }
  }

}
