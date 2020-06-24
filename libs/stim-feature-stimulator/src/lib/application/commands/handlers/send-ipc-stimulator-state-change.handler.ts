import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IpcFacade } from '@diplomka-backend/stim-feature-ipc';

import { SendIpcStimulatorStateChangeCommand } from '../impl/send-ipc-stimulator-state-change.command';
import { Logger } from '@nestjs/common';

@CommandHandler(SendIpcStimulatorStateChangeCommand)
export class SendIpcStimulatorStateChangeHandler
  implements ICommandHandler<SendIpcStimulatorStateChangeCommand, void> {
  private readonly logger: Logger = new Logger(
    SendIpcStimulatorStateChangeHandler.name
  );

  constructor(private readonly facade: IpcFacade) {}

  async execute(command: SendIpcStimulatorStateChangeCommand): Promise<void> {
    this.logger.debug(
      'Budu vytvářet příkaz pro odeslání stavu stimulátoru přes IPC.'
    );

    try {
      await this.facade.notifyStimulatorStateChange(command.state);
    } catch (e) {
      this.logger.error(
        'Nepodařilo se informovat IPC klienta o aktualizaci stavu stimulátoru!'
      );
      this.logger.error(e);
    }
  }
}
