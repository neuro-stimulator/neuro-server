import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { ExperimentPlayerStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendExperimentStateToClientCommand } from '../../impl/to-client/send-experiment-state-to-client.command';

@CommandHandler(SendExperimentStateToClientCommand)
export class SendExperimentStateToClientHandler implements ICommandHandler<SendExperimentStateToClientCommand, void> {
  private readonly logger: Logger = new Logger(SendExperimentStateToClientHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendExperimentStateToClientCommand): Promise<void> {
    if (command.clientID !== undefined) {
      this.logger.debug('Budu odesílat zprávu klientovi o stavu přehrávače experimentu.');
      await this.facade.sendCommand(
        command.clientID,
        new ExperimentPlayerStateMessage(command.initialized, command.ioData, command.repeat, command.betweenExperimentInterval, command.autoplay, command.isBreakTime)
      );
    } else {
      this.logger.debug('Budu broadcastovat informaci o stavu přehrávače experimentu.');
      await this.facade.broadcastCommand(
        new ExperimentPlayerStateMessage(command.initialized, command.ioData, command.repeat, command.betweenExperimentInterval, command.autoplay, command.isBreakTime)
      );
    }
  }
}
