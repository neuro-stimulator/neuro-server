import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcSendStimulatorStateChangeCommand } from '@diplomka-backend/stim-feature-ipc/application';

import { SendStimulatorStateChangeToIpcCommand } from '../../impl/to-ipc/send-stimulator-state-change-to-ipc.command';

@CommandHandler(SendStimulatorStateChangeToIpcCommand)
export class SendStimulatorStateChangeToIpcHandler implements ICommandHandler<SendStimulatorStateChangeToIpcCommand, void> {
  private readonly logger: Logger = new Logger(SendStimulatorStateChangeToIpcHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: SendStimulatorStateChangeToIpcCommand): Promise<void> {
    this.logger.debug('Budu vytvářet příkaz pro odeslání stavu stimulátoru přes IPC.');

    try {
      await this.commandBus.execute(new IpcSendStimulatorStateChangeCommand(command.state));
    } catch (e) {
      this.logger.error('Nepodařilo se informovat IPC klienta o aktualizaci stavu stimulátoru!');
      this.logger.error(e.message);
    }
  }
}
