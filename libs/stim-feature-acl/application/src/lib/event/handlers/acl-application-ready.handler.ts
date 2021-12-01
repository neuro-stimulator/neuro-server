import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { Acl } from '@stechy1/diplomka-share/lib';

import { ApplicationReadyEvent } from '@neuro-server/stim-lib-common';

import { GetAllAclQuery } from '../../query/impl/get-all-acl.query';
import { ReloadAclCommand } from '../../command/impl/reload-acl.command';

@EventsHandler(ApplicationReadyEvent)
export class AclApplicationReadyHandler implements IEventHandler<ApplicationReadyEvent> {

  private readonly logger: Logger = new Logger(AclApplicationReadyHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async handle(_event: ApplicationReadyEvent): Promise<void> {
    this.logger.log('Získávám všechna ACL..');
    const acl: Acl[] = await this.queryBus.execute(new GetAllAclQuery());
    this.logger.log('Nechávám přenačíst všechna ACL...')
    await this.commandBus.execute(new ReloadAclCommand(acl));
  }

}
