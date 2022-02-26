import { Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { FileAlreadyExistsException, FileLocation } from '@neuro-server/stim-feature-file-browser/domain';

import { FolderWasCreatedEvent } from '../../events/impl/folder-was-created.event';
import { FileBrowserService } from '../../service/file-browser.service';
import { CreateNewFolderCommand } from '../impl/create-new-folder.command';

@CommandHandler(CreateNewFolderCommand)
export class CreateNewFolderHandler implements ICommandHandler<CreateNewFolderCommand, [string, string]> {
  private readonly logger: Logger = new Logger(CreateNewFolderHandler.name);

  constructor(private readonly service: FileBrowserService, private readonly eventBus: EventBus) {}

  async execute(command: CreateNewFolderCommand): Promise<[string, string]> {
    this.logger.debug(`Budu vytvářet novou '${command.location}' složku: '${command.path}'`);
    this.logger.debug('1. Získám název složky, kterou budu vytvářet.');
    const folderName = command.path.substring(command.path.lastIndexOf('/') + 1);
    this.logger.debug(`{folderName=${folderName}}`);
    this.logger.debug('2. Rozsekám si cestu na jednotlivé podsložky.');
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = command.path.split('/');
    this.logger.debug(`{subfolders=${subfolders}}`);
    this.logger.debug('3. Uložím si cestu k rodičovské složce.');
    // Uložím si cestu k rodičovské složce
    const parentSubfolders = subfolders.slice(0, subfolders.length - 1);
    // Vytvořím úplnou cestu k rodičovské složce
    // Zajímá mě hlavně, zdali tato složka existuje
    // Když ne, tak se vyhodí vyjímka
    const parentPath = this.mergePath(command.location, true, parentSubfolders);
    this.logger.debug(`{parentPath=${parentPath}}`);

    this.logger.debug('4. Uložím si kompletní cestu ke složce, kterou budu vytvářet.');
    // Spojím dohromady název složky s kompletní veřejnou cestou k ní
    const subfolderPath = this.mergePath(command.location, false, subfolders);
    this.logger.debug(`{subfolderPath=${subfolderPath}}`);

    // Ověřím, že složka ještě neexistuje
    if (this.service.existsFile(subfolderPath)) {
      this.logger.debug('Složka je již vytvořená.');
      if (command.throwExceptionIfExists) {
        this.logger.debug('Bude vyhozena vyjímka.');
        throw new FileAlreadyExistsException(subfolderPath);
      } else {
        this.logger.debug('5. Nic víc už delat nebudu.');
        return [parentSubfolders.join('/'), folderName];
      }
    }
    this.logger.debug('5. Vytvářím novou složku.');
    // Když je vše v pořádku, vytvořím novou složku
    await this.service.createDirectory(subfolderPath, true);
    // Zveřejním událost, že byla vytvořena nová složka
    this.eventBus.publish(new FolderWasCreatedEvent(subfolderPath));
    // Vrátím cestu k rodičovské složce
    return [parentSubfolders.join('/'), folderName];
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
