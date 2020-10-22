import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { FirmwareUpdateCommand } from '../../commands/impl/firmware-update.command';

@EventsHandler(FirmwareUpdateCommand)
export class FirmwareUpdatedHandler implements IEventHandler<FirmwareUpdateCommand> {
  private readonly logger: Logger = new Logger(FirmwareUpdatedHandler.name);

  handle(event: FirmwareUpdateCommand): void {
    this.logger.debug('Firmware byl úspěšně aktualizován.');
  }
}
