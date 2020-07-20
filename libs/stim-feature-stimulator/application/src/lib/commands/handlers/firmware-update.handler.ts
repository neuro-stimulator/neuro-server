import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { StimulatorService } from '../../service/stimulator.service';
import { FirmwareUpdatedEvent } from '../../events/impl/firmware-updated.event';
import { FirmwareUpdateCommand } from '../impl/firmware-update.command';

@CommandHandler(FirmwareUpdateCommand)
export class FirmwareUpdateHandler implements ICommandHandler<FirmwareUpdateCommand, void> {
  private readonly logger: Logger = new Logger(FirmwareUpdateHandler.name);
  constructor(private readonly service: StimulatorService, private readonly facade: FileBrowserFacade, private readonly eventBus: EventBus) {}

  async execute(command: FirmwareUpdateCommand): Promise<void> {
    this.logger.debug('Budu aktualizovat firmware stimulátoru.');
    this.logger.debug('1. Získám plnou cestu k souboru s firmware.');
    // Získám bezpečnou plnou cestu k souboru firmware
    const firmwareFile = await this.facade.mergePublicPath(command.path, true);
    this.logger.debug(`Cesta k souboru s firmware: '${firmwareFile}'.`);
    this.logger.debug('3. Aktualizuji firmware.');
    // Aktualizuji firmware ve stimulátoru
    await this.service.updateFirmware(firmwareFile);
    // Zvěřejním událost, že firmware byl úspěšně aktulizován
    this.eventBus.publish(new FirmwareUpdatedEvent(command.path));
  }
}
