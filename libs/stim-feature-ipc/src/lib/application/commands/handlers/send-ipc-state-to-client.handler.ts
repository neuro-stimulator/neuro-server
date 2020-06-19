import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { IpcService } from '../../../domain/services/ipc.service';
import { SendIpcStateToClientCommand } from '../impl/send-ipc-state-to-client.command';

@CommandHandler(SendIpcStateToClientCommand)
export class SendIpcStateToClientHandler
  implements ICommandHandler<SendIpcStateToClientCommand, void> {
  private readonly logger: Logger = new Logger(
    SendIpcStateToClientHandler.name
  );

  constructor(
    private readonly service: IpcService,
    private readonly facade: SocketFacade
  ) {}

  async execute(command: SendIpcStateToClientCommand): Promise<void> {
    this.logger.debug(
      `Budu odesílat informaci o IPC stavu klientovi s ID: '${command.clientID}'.`
    );
    this.logger.debug('1. Získám aktuální IPC stav.');
    const state = this.service.isConnected;
    this.logger.debug(`Stav IPC: {connected=${state}}.`);
    this.logger.debug('2. Odešlu tuto informaci klientovi.');
    await this.facade.sendCommand(command.clientID, { ipc: state });
  }
}
