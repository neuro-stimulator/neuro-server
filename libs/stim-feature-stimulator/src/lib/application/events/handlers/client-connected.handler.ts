import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { StimulatorConnectionStateMessage, StimulatorDataStateMessage } from '@stechy1/diplomka-share';

import { ClientConnectedEvent, SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator';

import { GetStimulatorConnectionStatusQuery } from '../../queries/impl/get-stimulator-connection-status.query';
import { StimulatorStateCommand } from '../../commands/impl/stimulator-state.command';
import { SendStimulatorStateChangeToClientCommand } from '../../commands/impl/to-client/send-stimulator-state-change-to-client.command';

@EventsHandler(ClientConnectedEvent)
export class ClientConnectedHandler implements IEventHandler<ClientConnectedEvent> {
  private readonly logger: Logger = new Logger(ClientConnectedHandler.name);
  constructor(private readonly facade: SocketFacade, private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async handle(event: ClientConnectedEvent): Promise<void> {
    this.logger.debug(`Budu odesílat informaci o stavu připojení stimulátoru klientovi s ID: '${event.clientID}'.`);
    this.logger.debug('1. Získám aktuální stav připojení stimulátoru.');
    // Získám aktuální stav připojení stimulátoru
    const connected = await this.queryBus.execute<GetStimulatorConnectionStatusQuery, boolean>(new GetStimulatorConnectionStatusQuery());
    this.logger.debug(`Stav připojení stimulátoru: {connected=${connected}}.`);
    this.logger.debug('2. Odešlu tuto informaci klientovi.');
    // Odešlu informaci o připojení stimulátoru klientovi
    await this.facade.sendCommand(event.clientID, new StimulatorConnectionStateMessage(connected));
    // Pokud je stimulátor připojený, získám si jeho stav
    if (connected) {
      this.logger.debug('3. Získám informaci o stavu stimulátoru jako takového.');
      const stateData: StimulatorStateData = await this.commandBus.execute(new StimulatorStateCommand(true));
      this.logger.debug(`Stav stimulátoru: {state=${stateData.state}}.`);
      this.logger.debug('4. Odešlu stav stimulátoru klientovi.');
      await this.facade.sendCommand(event.clientID, new StimulatorDataStateMessage(stateData.state));
      // await this.commandBus.execute(new SendStimulatorStateChangeToClientCommand(stateData.state));
    }
  }
}
