import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import {
  ClientConnectedEvent,
  SocketFacade,
} from '@diplomka-backend/stim-lib-socket';

import { GetStimulatorConnectionStatusQuery } from '../../queries';

@EventsHandler(ClientConnectedEvent)
export class ClientConnectedHandler
  implements IEventHandler<ClientConnectedEvent> {
  private readonly logger: Logger = new Logger(ClientConnectedHandler.name);
  constructor(
    private readonly facade: SocketFacade,
    private readonly queryBus: QueryBus
  ) {}

  async handle(event: ClientConnectedEvent): Promise<void> {
    this.logger.debug(
      `Budu odesílat informaci o stavu připojení stimulátoru klientovi s ID: '${event.clientID}'.`
    );
    this.logger.debug('1. Získám aktuální stav připojení stimulátoru.');
    // Získám aktuální stav připojení stimulátoru
    const connected = await this.queryBus.execute<
      GetStimulatorConnectionStatusQuery,
      boolean
    >(new GetStimulatorConnectionStatusQuery());
    this.logger.debug(
      `\t Stav připojení stimulátoru: {connected=${connected}}.`
    );
    this.logger.debug('2. Odešlu tuto informaci klientovi');
    // Odešlu informaci o připojení stimulátoru klientovi
    await this.facade.sendCommand(event.clientID, { connected });
  }
}
