import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { IpcConnectionStateMessage, StimulatorConnectionStateMessage, StimulatorDataStateMessage } from '@stechy1/diplomka-share';

import { ClientConnectionReadyEvent, SocketFacade } from '@diplomka-backend/stim-lib-socket';
import { IsIpcConnectedQuery } from '@diplomka-backend/stim-feature-ipc';
import { StimulatorStateData } from '@diplomka-backend/stim-feature-stimulator/domain';
import { GetStimulatorConnectionStatusQuery, StimulatorStateCommand } from '@diplomka-backend/stim-feature-stimulator/application';

@EventsHandler(ClientConnectionReadyEvent)
export class ConnectionClientReadyHandler implements IEventHandler<ClientConnectionReadyEvent> {
  private readonly logger: Logger = new Logger(ConnectionClientReadyHandler.name);
  constructor(private readonly socketFacade: SocketFacade, private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async handle(event: ClientConnectionReadyEvent): Promise<void> {
    this.logger.debug(`Budu odesílat informaci o stavu připojení stimulátoru klientovi s ID: '${event.clientID}'.`);
    this.logger.debug('1. Získám aktuální stav připojení stimulátoru.');
    // Získám aktuální stav připojení stimulátoru
    const stimulatorConnected = await this.queryBus.execute<GetStimulatorConnectionStatusQuery, boolean>(new GetStimulatorConnectionStatusQuery());
    this.logger.debug(`Stav připojení stimulátoru: {connected=${stimulatorConnected}}.`);
    this.logger.debug('2. Odešlu tuto informaci klientovi.');
    // Odešlu informaci o připojení stimulátoru klientovi
    await this.socketFacade.sendCommand(event.clientID, new StimulatorConnectionStateMessage(stimulatorConnected));

    this.logger.debug('3. Získám aktuální stav IPC klienta.');
    const ipcConnected = await this.queryBus.execute(new IsIpcConnectedQuery());
    this.logger.debug(`Stav připojení IPC klienta: {connected=${ipcConnected}}`);
    this.logger.debug('4. Odešlu tuto informaci klientovi.');
    // Odešlu informaci o připojení IPC klienta
    await this.socketFacade.sendCommand(event.clientID, new IpcConnectionStateMessage(ipcConnected));

    // Pokud je stimulátor připojený, získám si jeho stav
    if (stimulatorConnected) {
      this.logger.debug('5. Získám informaci o stavu stimulátoru jako takového.');
      const stateData: StimulatorStateData = await this.commandBus.execute(new StimulatorStateCommand(true));
      this.logger.debug(`Stav stimulátoru: {state=${stateData.state}}.`);
      this.logger.debug('6. Odešlu stav stimulátoru klientovi.');
      await this.socketFacade.sendCommand(event.clientID, new StimulatorDataStateMessage(stateData.state));
    }
  }
}
