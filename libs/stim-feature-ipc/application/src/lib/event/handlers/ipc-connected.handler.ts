import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { GetPublicPathQuery } from '@diplomka-backend/stim-feature-file-browser';

import { IpcSetPublicPathCommand } from '../../commands/impl/ipc-set-public-path.command';
import { IpcConnectedEvent } from '../impl/ipc-connected.event';

@EventsHandler(IpcConnectedEvent)
export class IpcConnectedHandler implements IEventHandler<IpcConnectedEvent> {
  private readonly logger: Logger = new Logger(IpcConnectedHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async handle(event: IpcConnectedEvent): Promise<void> {
    this.logger.log(`IPC klient s id: ${event.clientID} se připojil...`);
    const publicPath = await this.queryBus.execute(new GetPublicPathQuery());
    this.logger.debug('Budu odesílat IPC klientovi cestu k assetům.');
    await this.commandBus.execute(new IpcSetPublicPathCommand(publicPath));
  }
}
