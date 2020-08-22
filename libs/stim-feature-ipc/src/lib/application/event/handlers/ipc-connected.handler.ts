import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { GetPublicPathQuery } from '@diplomka-backend/stim-feature-file-browser';

import { IpcSendMessageCommand } from '../../commands/impl/ipc-send-message.command';
import { ServerPublicPathMessage } from '../../../domain/model/ipc-message';
import { IpcConnectedEvent } from '../impl/ipc-connected.event';

@EventsHandler(IpcConnectedEvent)
export class IpcConnectedHandler implements IEventHandler<IpcConnectedEvent> {
  private readonly logger: Logger = new Logger(IpcConnectedHandler.name);

  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async handle(event: IpcConnectedEvent): Promise<void> {
    this.logger.log(`IPC klient s id: ${event.clientID} se připojil...`);
    const publicPath = await this.queryBus.execute(new GetPublicPathQuery());
    this.logger.debug('Budu odesílat IPC klientovi cestu k assetům.');
    await this.commandBus.execute(new IpcSendMessageCommand(new ServerPublicPathMessage(publicPath)));
  }
}
