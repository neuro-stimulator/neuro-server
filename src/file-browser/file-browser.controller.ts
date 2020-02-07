import { Response } from 'express';

import { Controller, Delete, Get, Logger, Options, Param, Post, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';

import { ResponseObject, FileRecord, MessageCodes } from '@stechy1/diplomka-share';

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
        return { data: [], message: { code: MessageCodes.CODE_ERROR } };
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

      return {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_CREATED,
          params: {
            name: FileBrowserService.mergePath(...subfolders)
          }
        }
      };

    } catch (e) {
      return { message: { code: MessageCodes.CODE_ERROR } };
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

      return {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_UPLOADED,
          params: {
            name: FileBrowserService.mergePath(...subfolders)
          }
        }
      };

    } catch (e) {
      return { message: { code: MessageCodes.CODE_ERROR_FILE_BROWSER_FILES_NOT_UPLOADED } };
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

      return {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_DELETED,
          params: {
            name: FileBrowserService.mergePath(...subfolders)
          }
        }
      };

    } catch (e) {
      return { data: [], message: { code: MessageCodes.CODE_ERROR_FILE_BROWSER_FILES_NOT_DELETED } };
    }
  }
}
