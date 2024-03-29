import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { AclEntity } from '@neuro-server/stim-feature-acl/domain';
import { SeedRepositoryEvent } from '@neuro-server/stim-feature-seed/application';

import { AclService } from '../../service/acl.service';

@EventsHandler(SeedRepositoryEvent)
export class AclSeedRepositoryHandler implements IEventHandler<SeedRepositoryEvent> {

  private readonly logger: Logger = new Logger(AclSeedRepositoryHandler.name);

  constructor(private readonly service: AclService) {}

  public async handle(event: SeedRepositoryEvent): Promise<void> {
    if (event.entity == AclEntity) {
      this.logger.debug('Byly načteny nové datakontejnery. Znovu načítám všechna ACL...');
      this.service.reloadAclFromEntities(event.entities as AclEntity[]);
    }
  }

}
