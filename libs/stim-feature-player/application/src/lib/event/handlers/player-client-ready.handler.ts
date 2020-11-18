import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ClientConnectionReadyEvent } from '@diplomka-backend/stim-lib-socket';

import { PlayerService } from '../../service/player.service';
import { SendPlayerStateToClientCommand } from '../../commands/impl/to-client/send-player-state-to-client.command';

@EventsHandler(ClientConnectionReadyEvent)
export class PlayerClientReadyHandler implements IEventHandler<ClientConnectionReadyEvent> {
  private readonly logger: Logger = new Logger(PlayerClientReadyHandler.name);

  constructor(private readonly service: PlayerService, private readonly commandBus: CommandBus) {}

  async handle(event: ClientConnectionReadyEvent): Promise<void> {
    this.logger.debug('Budu připojenému klitovi odesílat informaci o stavu přehrávače experimentu.');

    await this.commandBus.execute(new SendPlayerStateToClientCommand(this.service.playerConfiguration, event.clientID));
  }
}
