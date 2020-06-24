import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendStimulatorDataToClientCommand } from '../impl/send-stimulator-data-to-client.command';

@CommandHandler(SendStimulatorDataToClientCommand)
export class SendStimulatorDataToClientHandler
  implements ICommandHandler<SendStimulatorDataToClientCommand, void> {
  private readonly logger: Logger = new Logger(
    SendStimulatorDataToClientHandler.name
  );

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendStimulatorDataToClientCommand): Promise<void> {
    this.logger.debug('Odesílám data ze stimulátoru klientovi...');
    await this.facade.broadcastCommand(command.data);
  }
}
