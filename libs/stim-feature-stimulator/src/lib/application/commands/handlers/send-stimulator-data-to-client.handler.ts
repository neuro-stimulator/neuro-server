import { Logger } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendStimulatorDataToClientCommand } from '../impl/send-stimulator-data-to-client.command';

export class SendStimulatorDataToClientHandler
  implements ICommandHandler<SendStimulatorDataToClientCommand, void> {
  private readonly logger: Logger = new Logger(
    SendStimulatorDataToClientHandler.name
  );

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendStimulatorDataToClientCommand): Promise<void> {
    this.logger.log('Odesílám data ze stimulátoru klientovi...');
    await this.facade.broadcastCommand(command.data);
  }
}
