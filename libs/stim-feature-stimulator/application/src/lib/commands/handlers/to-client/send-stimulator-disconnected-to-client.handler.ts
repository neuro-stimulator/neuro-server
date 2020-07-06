import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { StimulatorConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@diplomka-backend/stim-lib-socket';

import { SendStimulatorDisconnectedToClientCommand } from '../../impl/to-client/send-stimulator-disconnected-to-client.command';

@CommandHandler(SendStimulatorDisconnectedToClientCommand)
export class SendStimulatorDisconnectedToClientHandler
  implements ICommandHandler<SendStimulatorDisconnectedToClientCommand, void> {
  private readonly logger: Logger = new Logger(
    SendStimulatorDisconnectedToClientHandler.name
  );

  constructor(private readonly facade: SocketFacade) {}

  async execute(
    command: SendStimulatorDisconnectedToClientCommand
  ): Promise<void> {
    await this.facade.broadcastCommand(
      new StimulatorConnectionStateMessage(false)
    );
  }
}
