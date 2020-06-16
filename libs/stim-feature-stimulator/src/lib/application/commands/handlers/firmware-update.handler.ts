import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { FileBrowserFacade } from '@diplomka-backend/stim-feature-file-browser';

import { StimulatorService } from '../../../domain/service/stimulator.service';
import { FirmwareUpdatedEvent } from '../../events';
import { FirmwareUpdateCommand } from '../impl/firmware-update.command';

@CommandHandler(FirmwareUpdateCommand)
export class FirmwareUpdateHandler
  implements ICommandHandler<FirmwareUpdateCommand, void> {
  private readonly logger: Logger = new Logger(FirmwareUpdateHandler.name);
  constructor(
    private readonly service: StimulatorService,
    private readonly facade: FileBrowserFacade,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: FirmwareUpdateCommand): Promise<void> {
    // Získám bezpečnou plnou cestu k souboru firmware
    const firmwareFile = await this.facade.mergePublicPath(command.path);
    // Aktualizuji firmware ve stimulátoru
    await this.service.updateFirmware(firmwareFile);
    // Odstraním soubor s firmware
    await this.facade.deleteFile(firmwareFile);
    // Zvěřejním událost, že firmware byl úspěšně aktulizován
    this.eventBus.publish(new FirmwareUpdatedEvent());
  }
}
