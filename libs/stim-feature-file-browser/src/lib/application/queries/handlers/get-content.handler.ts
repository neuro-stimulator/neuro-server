import { ReadStream } from 'fs';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileLocation } from '../../../domain/model/file-location';
import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { FileNotFoundException } from '../../../domain/exception/file-not-found.exception';
import { GetContentQuery } from '../impl/get-content.query';

@QueryHandler(GetContentQuery)
export class GetContentHandler implements IQueryHandler<GetContentQuery, FileRecord[] | ReadStream | string> {
  private readonly logger: Logger = new Logger(GetContentHandler.name);

  constructor(private readonly service: FileBrowserService) {}

  async execute(query: GetContentQuery): Promise<FileRecord[] | ReadStream | string> {
    this.logger.debug(`Budu číst obsah souboru: '${query.path}'.`);
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = query.path.split('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.mergePath(query.location, true, subfolders);

    let isDirectory = false;
    try {
      // Nejdříve si zjistím, zda-li se jedná o složku
      isDirectory = this.service.isDirectory(subfolderPath);
      // TODO zjistit, zdali je opravdu potřeba tu složku vytvářet
      // await this.service.createDirectory(subfolderPath, true);
      // Pokud ano, tak budu vracet seznam souborů v zadané složce
      if (isDirectory) {
        // return FileRecord[]
        return this.service.getFilesFromDirectory(subfolderPath, query.location);
      } else {
        // Jedná se o soubor, budu ho tedy vracet celý
        // No a teď záleží na platformě
        if (process.platform === 'win32') {
          // Na windows musím vrátít stream
          // return ReadStream
          return this.service.readFileStream(subfolderPath);
        } else {
          // Na linuxové platformě budu vracet pouze cestu k souboru,
          // který chci odeslat
          // return string
          return subfolderPath;
        }
      }
    } catch (e) {
      this.logger.error(e);
      throw new FileNotFoundException(query.path);
    }
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
