import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendStimulatorStateChangeToClientCommand } from '../../impl/to-client/send-stimulator-state-change-to-client.command';
import { StimulatorDataStateMessage } from '@stechy1/diplomka-share';

@CommandHandler(SendStimulatorStateChangeToClientCommand)
export class SendStimulatorStateChangeToClientHandler
  implements ICommandHandler<SendStimulatorStateChangeToClientCommand, void> {
  private readonly logger: Logger = new Logger(
    SendStimulatorStateChangeToClientHandler.name
  );

  constructor(private readonly facade: SocketFacade) {}

  async execute(
    command: SendStimulatorStateChangeToClientCommand
  ): Promise<void> {
    this.logger.debug('Odesílám aktualizaci stavu stimulátoru klientovi.');
    await this.facade.broadcastCommand(
      new StimulatorDataStateMessage(command.state)
    );
  }
}
