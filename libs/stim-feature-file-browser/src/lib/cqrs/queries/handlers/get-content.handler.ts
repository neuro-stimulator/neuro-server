import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetContentQuery } from '../impl';
import { FileBrowserService } from '../../../infrastructure/file-browser.service';

@QueryHandler(GetContentQuery)
export class GetContentHandler implements IQueryHandler<GetContentQuery> {
  constructor(private readonly service: FileBrowserService) {}

  async execute(query: GetContentQuery): Promise<any> {
    const subfolders = query.folders[0].split('/');
    const subfolderPath = this.service.mergePublicPath(...subfolders);
    let isDirectory = false;
    try {
      isDirectory = this.service.isDirectory(subfolderPath);
      await this.service.createDirectory(subfolderPath, true);
      if (isDirectory) {
        return this.service.getFilesFromDirectory(subfolderPath);
      } else {
        if (process.platform === 'win32') {
          // Toto pro změnu nefunguje na linuxu
          const readStream = this.service.readFileStream(subfolderPath);
          // We replaced all the event handlers with a simple call to readStream.pipe()
          // readStream.pipe(response);
        } else {
          // Nevím proč, ale na Windows tohle nefunguje
          //       response.sendFile(subfolderPath, (e) => {
          //         this.logger.error(e);
          //       });
        }
      }
    } catch (e) {
      if (isDirectory) {
        return;
      }
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
