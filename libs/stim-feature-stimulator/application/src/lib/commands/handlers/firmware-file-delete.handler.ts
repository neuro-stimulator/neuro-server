import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { FirmwareFileDeleteCommand } from '../impl/firmware-file-delete.command';

@CommandHandler(FirmwareFileDeleteCommand)
export class FirmwareFileDeleteHandler implements ICommandHandler<FirmwareFileDeleteCommand, void> {
  private readonly logger: Logger = new Logger(FirmwareFileDeleteHandler.name);

  constructor(private readonly facade: FileBrowserFacade) {}

  async execute(command: FirmwareFileDeleteCommand): Promise<void> {
    this.logger.debug('Budu odstraňovat firmware z úložiště.');
    // Odstraním soubor s firmware
    await this.facade.deleteFile(command.path);
  }
}
