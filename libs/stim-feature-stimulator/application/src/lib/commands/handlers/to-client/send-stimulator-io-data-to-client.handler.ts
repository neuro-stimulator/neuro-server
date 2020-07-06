import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorDataIOMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendStimulatorIoDataToClientCommand } from '../../impl/to-client/send-stimulator-io-data-to-client.command';

@CommandHandler(SendStimulatorIoDataToClientCommand)
export class SendStimulatorIoDataToClientHandler
  implements ICommandHandler<SendStimulatorIoDataToClientCommand, void> {
  private readonly logger: Logger = new Logger(
    SendStimulatorIoDataToClientHandler.name
  );

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendStimulatorIoDataToClientCommand): Promise<void> {
    this.logger.debug('Odesílám nový IO event ze stimulátoru klientovi.');
    await this.facade.broadcastCommand(
      new StimulatorDataIOMessage(command.ioEvent)
    );
  }
}
