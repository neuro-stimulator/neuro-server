import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { ContentWasNotWrittenException } from '@neuro-server/stim-feature-file-browser/domain';

import { FileUploadFailedEvent } from '../../events/impl/file-upload-failed.event';
import { FileWasUploadedEvent } from '../../events/impl/file-was-uploaded.event';
import { FileBrowserService } from '../../service/file-browser.service';
import { UploadFilesCommand } from '../impl/upload-files.command';

@CommandHandler(UploadFilesCommand)
export class UploadFilesHandler implements ICommandHandler<UploadFilesCommand, void> {
  private readonly logger: Logger = new Logger(UploadFilesHandler.name);
  constructor(private readonly service: FileBrowserService, private readonly eventBus: EventBus) {}

  async execute(command: UploadFilesCommand): Promise<void> {
    this.logger.debug('Budu ukládat nahrané soubory...');
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = command.path.split('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.service.mergePublicPath(true, ...subfolders);
    this.logger.debug('1. Cílová složka, kam se budou soubory nahrávat.');
    this.logger.debug(`{subfolderPath=${subfolderPath}}`);

    // Nyní můžu bezpěčně uložit všechny soubory

    // Projdu soubor za souborem
    this.logger.debug('2. Projdu jednotlivé nahrané soubory a uložím je na místo určení.');
    for (const file of command.uploadedFiles) {
      // Sestavím cílovou cestu, kam budu soubor ukládat
      const destPath = this.service.mergePublicPath(false, ...subfolders, file.originalname);
      this.logger.debug(`Zapisuji do souboru: ${destPath}.`);
      // Soubor je vlastně fyzicky již přítomen, stačí ho
      // jenom přesunout, což zařídím přejmenováním
      try {
        await this.service.writeFileContent(destPath, file.buffer);
        // Zveřejním událost, že byl nahraný nový soubor
        this.eventBus.publish(new FileWasUploadedEvent(destPath));
      } catch (e) {
        // Odchytím případnou vyjímku pokud zápis do souboru selže
        this.eventBus.publish(new FileUploadFailedEvent(destPath, file.originalname));
        // Pokud se nejedná o mojí vyjímku, tak ukončím nahrávání zbytku souborů
        // a ukončím celou funkci
        if (!(e instanceof ContentWasNotWrittenException)) {
          throw e;
        }
      }
    }
  }
}
