import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { FileWasUploadedEvent } from '../../events/impl/file-was-uploaded.event';
import { UploadFilesCommand } from '../impl/upload-files.command';

@CommandHandler(UploadFilesCommand)
export class UploadFilesHandler
  implements ICommandHandler<UploadFilesCommand, void> {
  private readonly logger: Logger = new Logger(UploadFilesHandler.name);
  constructor(
    private readonly service: FileBrowserService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: UploadFilesCommand): Promise<void> {
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = command.path.split('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.service.mergePublicPath(true, ...subfolders);

    // Nyní můžu bezpěčně uložit všechny soubory

    // Projdu soubor za souborem
    for (const file of command.uploadedFiles) {
      // Sestavím cílovou cestu, kam budu soubor ukládat
      const destPath = this.service.mergePublicPath(
        false,
        subfolderPath,
        file.originalname
      );
      // Soubor je vlastně fyzicky již přítomen, stačí ho
      // jenom přesunout, což zařídím přejmenováním
      await this.service.rename(file.path, destPath);
      // Zveřejním událost, že byl nahraný nový soubor
      this.eventBus.publish(new FileWasUploadedEvent(destPath));
    }
  }
}
