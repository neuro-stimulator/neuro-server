import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentPlayerStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendPlayerStateToClientCommand } from '../../impl/to-client/send-player-state-to-client.command';

@CommandHandler(SendPlayerStateToClientCommand)
export class SendPlayerStateToClientHandler implements ICommandHandler<SendPlayerStateToClientCommand, void> {
  private readonly logger: Logger = new Logger(SendPlayerStateToClientHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendPlayerStateToClientCommand): Promise<void> {
    if (command.clientID !== undefined) {
      this.logger.debug('Budu odesílat zprávu klientovi o stavu přehrávače experimentu.');
      await this.facade.sendCommand(command.clientID, new ExperimentPlayerStateMessage(command.playerState));
    } else {
      this.logger.debug('Budu broadcastovat informaci o stavu přehrávače experimentu.');
      await this.facade.broadcastCommand(new ExperimentPlayerStateMessage(command.playerState));
    }
  }
}
