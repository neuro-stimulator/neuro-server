import { ReadStream } from 'fs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserService } from '../../../domain/service/file-browser.service';
import { FileNotFoundException } from '../../../domain/exception';
import { GetContentQuery } from '../impl/get-content.query';

@QueryHandler(GetContentQuery)
export class GetContentHandler
  implements
    IQueryHandler<GetContentQuery, FileRecord[] | ReadStream | string> {
  private readonly logger: Logger = new Logger(GetContentHandler.name);

  constructor(private readonly service: FileBrowserService) {}

  async execute(
    query: GetContentQuery
  ): Promise<FileRecord[] | ReadStream | string> {
    this.logger.debug(`Budu číst obsah souboru: '${query.path}'.`);
    // Rozsekám si cestu na jednotlivé podsložky
    const subfolders = query.path.split('/');
    // Abych je zase mohl zpátky spojit dohromady ale už i s veřejnou cestou na serveru
    const subfolderPath = this.service.mergePublicPath(true, ...subfolders);

    let isDirectory = false;
    try {
      // Nejdříve si zjistím, zda-li se jedná o složku
      isDirectory = this.service.isDirectory(subfolderPath);
      // TODO zjistit, zdali je opravdu potřeba tu složku vytvářet
      // await this.service.createDirectory(subfolderPath, true);
      // Pokud ano, tak budu vracet seznam souborů v zadané složce
      if (isDirectory) {
        // return FileRecord[]
        return this.service.getFilesFromDirectory(subfolderPath);
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
}

// const subfolders = param[0].split('/');
// const subfolderPath = this._service.mergePublicPath(...subfolders);
// let isDirectory = false;
//
// try {
//   isDirectory = this._service.isDirectory(subfolderPath);
//   if (isDirectory) {
//     await this._service.createDirectory(subfolderPath, true);
//     const files = await this._service.getFilesFromDirectory(subfolderPath);
//     response.json({ data: files });
//   } else {
//
//     if (process.platform === 'win32') {
//       // Toto pro změnu nefunguje na linuxu
//       const readStream = this._service.readFileStream(subfolderPath);
//       // We replaced all the event handlers with a simple call to readStream.pipe()
//       readStream.pipe(response);
//     } else {
//       // Nevím proč, ale na Windows tohle nefunguje
//       response.sendFile(subfolderPath, (e) => {
//         this.logger.error(e);
//       });
//     }
//
//   }
// } catch (e) {
//   if (isDirectory) {
//     return { data: [], message: { code: MessageCodes.CODE_ERROR } };
//   } else {
//     response.writeHead(404);
//     response.end(' ');
//   }
// }
