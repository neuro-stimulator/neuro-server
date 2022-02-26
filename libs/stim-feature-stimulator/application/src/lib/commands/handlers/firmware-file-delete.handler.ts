import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteFileCommand } from '@neuro-server/stim-feature-file-browser/application';

import { FirmwareFileDeleteCommand } from '../impl/firmware-file-delete.command';

@CommandHandler(FirmwareFileDeleteCommand)
export class FirmwareFileDeleteHandler implements ICommandHandler<FirmwareFileDeleteCommand, void> {
  private readonly logger: Logger = new Logger(FirmwareFileDeleteHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: FirmwareFileDeleteCommand): Promise<void> {
    this.logger.debug('Budu odstraňovat firmware z úložiště.');
    // Odstraním soubor s firmware
    return  this.commandBus.execute(new DeleteFileCommand(command.path));
  }
}
