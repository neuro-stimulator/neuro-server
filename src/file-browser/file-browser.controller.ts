import { Response } from 'express';

import { Controller, Delete, Get, Logger, Options, Param, Post, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';

import { ResponseMessageType, ResponseObject, FileRecord } from '@stechy1/diplomka-share';

import { FileBrowserService } from './file-browser.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFileStructure } from '../share/utils';

@Controller('api/file-browser')
export class FileBrowserController {

  private readonly logger: Logger = new Logger(FileBrowserController.name);

  constructor(private readonly browserService: FileBrowserService) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get('*')
  public async getContentContent(@Param() param: string[], @Res() response: Response) {
    const subfolders = param[0].split('/');
    const subfolderPath = FileBrowserService.mergePublicPath(...subfolders);
    let isDirectory = false;

    try {
      isDirectory = this.browserService.isDirectory(subfolderPath);
      if (isDirectory) {
        await this.browserService.createDirectory(subfolderPath, true);
        const files = await this.browserService.getFilesFromDirectory(subfolderPath);
        response.json({ data: files });
      } else {

        if (process.platform === 'win32') {
          // Toto pro změnu nefunguje na linuxu
          const readStream = this.browserService.readFile(subfolderPath);
          // We replaced all the event handlers with a simple call to readStream.pipe()
          readStream.pipe(response);
        } else {
          // Nevím proč, ale na Windows tohle nefunguje
          response.sendFile(subfolderPath, e => {
            this.logger.error(e);
          });
        }

      }
    } catch (e) {
      if (isDirectory) {
        return { data: [], message: { type: ResponseMessageType.ERROR, text: e } };
      } else {
        response.writeHead(404);
        response.end(' ');
      }
    }

  }

  @Put('*')
  public async createNewFolder(@Param() param: string[]): Promise<ResponseObject<FileRecord[]>> {
    const subfolders = param[0].split('/');
    const originalSubfolders = subfolders.slice(0, subfolders.length - 1);

    try {
      const subfolderPath = FileBrowserService.mergePublicPath(...subfolders);
      const originalSubfolderPath = await FileBrowserService.mergePublicPath(... originalSubfolders);
      await this.browserService.createDirectory(subfolderPath, true);
      const files = await this.browserService.getFilesFromDirectory(originalSubfolderPath);
      return { data: files, message: { type: ResponseMessageType.SUCCESS, text: 'Složka byla úspěšně vytvořena.'} };
    } catch (e) {
      return { message: { type: ResponseMessageType.ERROR, text: e } };
    }
  }

  @Post('*')
  @UseInterceptors(
    FilesInterceptor('files[]')
  )
  public async uploadFiles(@UploadedFiles() uploadedFiles: UploadedFileStructure[], @Param() param: string[]): Promise<ResponseObject<FileRecord[]>> {
    const subfolders = param[0].split('/');

    try {
      await this.browserService.saveFiles(uploadedFiles, param[0]);
      const subfolderPath = FileBrowserService.mergePublicPath(...subfolders);
      const files = await this.browserService.getFilesFromDirectory(subfolderPath);
      return { data: files, message: { type: ResponseMessageType.SUCCESS, text: 'Soubor(y) se úspěšně podařilo nahrát.' } };
    } catch (e) {
      return { message: { type: ResponseMessageType.ERROR, text: e } };
    }
  }

  @Delete('*')
  public async deleteFile(@Param() param: string[]): Promise<ResponseObject<FileRecord[]>> {
    const subfolders = param[0].split('/');
    const subfolderPath = FileBrowserService.mergePublicPath(...subfolders);
    const parentSubfolders = subfolders.length >= 1 ? subfolders.slice(0, subfolders.length - 1) : subfolders;
    const parentPath = FileBrowserService.mergePublicPath(...parentSubfolders);

    try {
      this.browserService.recursiveDelete(subfolderPath);
      const files = await this.browserService.getFilesFromDirectory(parentPath);
      return { data: files, message: { type: ResponseMessageType.SUCCESS, text: 'Soubor(y) se úspěšně podařilo smazat.' } };

    } catch (e) {
      return { data: [], message: { type: ResponseMessageType.ERROR, text: e } };
    }
  }
}
