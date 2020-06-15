import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileWasUploadedEvent } from '@diplomka-backend/stim-feature-file-browser';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import {
  FileAccessRestrictedException,
  FileNotFoundException,
} from '../../../domain/exception';
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
    const subfolderPath = this.service.mergePublicPath(...subfolders);
    // Ověřím, že cesta existuje
    if (!this.service.existsFile(subfolderPath)) {
      // Pokud neexistuje, vyhodím vyjímku
      throw new FileNotFoundException(subfolderPath);
    }
    // Ověřím, že uživatel nepřistupuje mimo veřejnou složku
    if (!this.service.isPublicPathSecured(subfolderPath)) {
      // Pokud se snaží podvádět, tak mu to včas zatrhnu
      throw new FileAccessRestrictedException(subfolderPath);
    }

    // Nyní můžu bezpěčně uložit všechny soubory

    // Projdu soubor za souborem
    for (const file of command.uploadedFiles) {
      // Sestavím cílovou cestu, kam budu soubor ukládat
      const destPath = this.service.mergePublicPath(
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
