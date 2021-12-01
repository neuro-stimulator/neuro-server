import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class AclFacade {
  private readonly logger = new Logger(AclFacade.name);

  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}
}
