import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ConnectionStatus } from '@stechy1/diplomka-share';

import { IpcService } from '../../services/ipc.service';
import { IpcConnectionStatusQuery } from '../impl/ipc-connection-status.query';

@QueryHandler(IpcConnectionStatusQuery)
export class IpcConnectionStatusHandler implements IQueryHandler<IpcConnectionStatusQuery, ConnectionStatus> {
  constructor(private readonly service: IpcService) {}

  async execute(query: IpcConnectionStatusQuery): Promise<ConnectionStatus> {
    return this.service.status;
  }
}
