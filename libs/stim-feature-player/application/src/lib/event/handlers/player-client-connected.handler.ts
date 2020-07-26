import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentPlayerStateMessage, IOEvent } from '@stechy1/diplomka-share';

import { ClientConnectedEvent, SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { PlayerService } from '../../service/player.service';

@EventsHandler(ClientConnectedEvent)
export class PlayerClientConnectedHandler implements IEventHandler<ClientConnectedEvent> {
  private readonly logger: Logger = new Logger(PlayerClientConnectedHandler.name);

  constructor(private readonly service: PlayerService, private readonly facade: SocketFacade) {}

  async handle(event: ClientConnectedEvent): Promise<void> {
    this.logger.debug('Budu připojenému klitovi odesílat informaci o stavu přehrávače experimentu.');
    let initialized;
    let data: IOEvent[][] = [];
    try {
      const active = this.service.activeExperimentResult;
      data = this.service.experimentResultData;
      initialized = true;
    } catch (e) {
      initialized = false;
    }
    await this.facade.sendCommand(event.clientID, new ExperimentPlayerStateMessage(initialized, this.service.experimentRound, data));
  }
}
