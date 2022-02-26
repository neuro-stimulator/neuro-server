import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage } from '@stechy1/diplomka-share';

import { GetPublicPathQuery } from '@neuro-server/stim-feature-file-browser/application';
import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { IpcSetPublicPathCommand } from '../../commands/impl/ipc-set-public-path.command';
import { IpcConnectedEvent } from '../impl/ipc-connected.event';

@EventsHandler(IpcConnectedEvent)
export class IpcConnectedHandler implements IEventHandler<IpcConnectedEvent> {
  private readonly logger: Logger = new Logger(IpcConnectedHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus, private readonly facade: SocketFacade) {}

  async handle(event: IpcConnectedEvent): Promise<void> {
    this.logger.log(`IPC klient s id: ${event.clientID} se připojil...`);
    const publicPath = await this.queryBus.execute(new GetPublicPathQuery());
    this.logger.debug('Budu odesílat IPC klientovi cestu k assetům.');
    await this.commandBus.execute(new IpcSetPublicPathCommand(publicPath));
    this.logger.debug('Budu informovat všechny klienty, že IPC klient se připojil.');
    await this.facade.broadcastCommand(new IpcConnectionStateMessage(ConnectionStatus.CONNECTED));
  }
}
