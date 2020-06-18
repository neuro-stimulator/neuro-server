import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { IpcService } from '../../../domain/services/ipc.service';
import { IpcStimulatorStateChangeCommand } from '../impl/ipc-stimulator-state-change.command';

@CommandHandler(IpcStimulatorStateChangeCommand)
export class IpcStimulatorStateChangeHandler
  implements ICommandHandler<IpcStimulatorStateChangeCommand, void> {
  private readonly logger: Logger = new Logger(
    IpcStimulatorStateChangeHandler.name
  );
  constructor(private readonly service: IpcService) {}

  async execute(command: IpcStimulatorStateChangeCommand): Promise<void> {
    // TODO handle ipc stimulator state change
    this.logger.log('Budu informovat IPC klienta o změně stavu stimulátoru.');
  }
}
