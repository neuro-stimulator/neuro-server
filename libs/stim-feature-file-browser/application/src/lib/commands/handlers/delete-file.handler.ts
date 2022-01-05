import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { FileLocation } from '@neuro-server/stim-feature-file-browser/domain';

import { FileBrowserService } from '../../service/file-browser.service';
import { FileWasDeletedEvent } from '../../events/impl/file-was-deleted.event';
import { DeleteFileCommand } from '../impl/delete-file.command';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand, string> {
  private readonly logger: Logger = new Logger(DeleteFileHandler.name);
  constructor(private readonly service: FileBrowserService, private readonly eventBus: EventBus) {}

  async execute(command: DeleteFileCommand): Promise<string> {
    this.logger.debug('Budu mazat soubor.');
    this.logger.debug('1. Rozdělím cestu na jednotlivé složky');
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = command.path.split('/');
    this.logger.debug(`{subfolders=${subfolders}`);
    this.logger.debug('2. Získám rodičovskou cestu složek.');
    // Uložím si rodičovskou cestu složek
    const originalSubfolders = (subfolders.length >= 1 ? subfolders.slice(0, subfolders.length - 1) : subfolders).join('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.mergePath(command.location, true, subfolders);
    this.logger.debug(`{subfolderPath=${subfolderPath}}`);

    this.logger.debug('3. Rekurzivně smažu soubor nebo obsah složky společne se složkou.');
    // Provedu samotné mazání souborů v zadané složce
    this.service.recursiveDelete(subfolderPath);
    // Zvěřejním událost, že byl smazaný soubor
    this.eventBus.publish(new FileWasDeletedEvent(command.path));
    // Nakonec vrátím rodičovskou složku smazané složky
    return originalSubfolders;
  }

  /**
   * Pomocná funkce která rozliší, lokaci na základě které se bude spojovat
   * privání nebo veřejná cesta
   *
   * @param location 'public' nebo 'private'
   * @param exceptionIfNotFound Pokud true, vyhodí se vyjímka když soubor není nalezen
   * @param subfolders Cesta k souboru
   */
  private mergePath(location: FileLocation, exceptionIfNotFound: boolean, subfolders: string[]) {
    switch (location) {
      case 'public':
        return this.service.mergePublicPath(exceptionIfNotFound, ...subfolders);
      case 'private':
        return this.service.mergePrivatePath(exceptionIfNotFound, ...subfolders);
    }
  }
}
