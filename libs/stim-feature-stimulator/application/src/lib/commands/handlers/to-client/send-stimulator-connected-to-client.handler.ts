import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConnectionStatus, StimulatorConnectionStateMessage } from '@stechy1/diplomka-share';

import { SocketFacade } from '@neuro-server/stim-lib-socket';

import { SendStimulatorConnectedToClientCommand } from '../../impl/to-client/send-stimulator-connected-to-client.command';

@CommandHandler(SendStimulatorConnectedToClientCommand)
export class SendStimulatorConnectedToClientHandler implements ICommandHandler<SendStimulatorConnectedToClientCommand, void> {
  private readonly logger: Logger = new Logger(SendStimulatorConnectedToClientHandler.name);

  constructor(private readonly facade: SocketFacade) {}

  async execute(command: SendStimulatorConnectedToClientCommand): Promise<void> {
    await this.facade.broadcastCommand(new StimulatorConnectionStateMessage(ConnectionStatus.CONNECTED));
  }
}
