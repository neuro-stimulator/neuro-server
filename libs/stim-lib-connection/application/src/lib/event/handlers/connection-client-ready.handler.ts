import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

import { ConnectionStatus, IpcConnectionStateMessage, StimulatorConnectionStateMessage, StimulatorDataStateMessage } from '@stechy1/diplomka-share';

import { ClientConnectionReadyEvent, SocketFacade } from '@neuro-server/stim-lib-socket';
import { IpcConnectionStatusQuery } from '@neuro-server/stim-feature-ipc/application';
import { StimulatorStateData } from '@neuro-server/stim-feature-stimulator/domain';
import { GetStimulatorConnectionStatusQuery, StimulatorStateCommand } from '@neuro-server/stim-feature-stimulator/application';

@EventsHandler(ClientConnectionReadyEvent)
export class ConnectionClientReadyHandler implements IEventHandler<ClientConnectionReadyEvent> {
  private readonly logger: Logger = new Logger(ConnectionClientReadyHandler.name);

  constructor(private readonly socketFacade: SocketFacade, private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  async handle(event: ClientConnectionReadyEvent): Promise<void> {
    this.logger.debug(`Budu odesílat informaci o stavu připojení stimulátoru klientovi s ID: '${event.clientID}'.`);
    this.logger.debug('1. Získám aktuální stav připojení stimulátoru.');
    // Získám aktuální stav připojení stimulátoru
    const stimulatorConnectionStatus: ConnectionStatus = await this.queryBus.execute(new GetStimulatorConnectionStatusQuery());
    this.logger.debug(`Stav připojení stimulátoru: {stimulatorConnectionStatus=${ConnectionStatus[stimulatorConnectionStatus]}}.`);
    this.logger.debug('2. Odešlu tuto informaci klientovi.');
    // Odešlu informaci o připojení stimulátoru klientovi
    await this.socketFacade.sendCommand(event.clientID, new StimulatorConnectionStateMessage(stimulatorConnectionStatus));

    this.logger.debug('3. Získám aktuální stav IPC klienta.');
    const ipcConnectionStatus = await this.queryBus.execute(new IpcConnectionStatusQuery());
    this.logger.debug(`Stav připojení IPC klienta: {ipcConnectionStatus=${ConnectionStatus[ipcConnectionStatus]}}`);
    this.logger.debug('4. Odešlu tuto informaci klientovi.');
    // Odešlu informaci o připojení IPC klienta
    await this.socketFacade.sendCommand(event.clientID, new IpcConnectionStateMessage(ipcConnectionStatus));

    // Pokud je stimulátor připojený, získám si jeho stav
    if (stimulatorConnectionStatus === ConnectionStatus.CONNECTED) {
      this.logger.debug('5. Získám informaci o stavu stimulátoru jako takového.');
      const stateData: StimulatorStateData = await this.commandBus.execute(new StimulatorStateCommand(true));
      this.logger.debug(`Stav stimulátoru: {state=${stateData.state}}.`);
      this.logger.debug('6. Odešlu stav stimulátoru klientovi.');
      await this.socketFacade.sendCommand(event.clientID, new StimulatorDataStateMessage(stateData.state));
    }
  }
}
