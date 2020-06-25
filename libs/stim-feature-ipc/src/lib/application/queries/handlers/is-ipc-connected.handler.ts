import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IpcService } from '../../../domain/services/ipc.service';
import { IsIpcConnectedQuery } from '../impl/is-ipc-connected.query';

@QueryHandler(IsIpcConnectedQuery)
export class IsIpcConnectedHandler
  implements IQueryHandler<IsIpcConnectedQuery, boolean> {
  constructor(private readonly service: IpcService) {}

  async execute(query: IsIpcConnectedQuery): Promise<boolean> {
    return this.service.isConnected;
  }
}
