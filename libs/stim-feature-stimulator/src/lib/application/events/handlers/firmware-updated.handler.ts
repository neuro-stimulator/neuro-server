import { IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FirmwareUpdateCommand } from '../../commands/impl/firmware-update.command';

export class FirmwareUpdatedHandler
  implements IEventHandler<FirmwareUpdateCommand> {
  private readonly logger: Logger = new Logger(FirmwareUpdatedHandler.name);

  constructor() {}

  handle(event: FirmwareUpdateCommand): any {
    this.logger.debug('Firmware byl úspěšně aktualizován.');
  }
}
