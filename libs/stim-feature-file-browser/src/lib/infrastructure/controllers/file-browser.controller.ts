import { ReadStream } from 'fs';
import { Response } from 'express';

import { FilesInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Delete,
  Get,
  Logger,
  Options,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileRecord,
  MessageCodes,
  ResponseObject,
} from '@stechy1/diplomka-share';

import { FileNotFoundException } from '../../domain/exception';
import { UploadedFileStructure } from '../../domain/model/uploaded-file-structure';
import {
  FileAccessRestrictedException,
  FileAlreadyExistsException,
  FolderIsUnableToCreateException,
} from '../../domain/exception';
import { FileBrowserFacade } from '../service/file-browser.facade';

@Controller('/api/file-browser')
export class FileBrowserController {
  private readonly logger: Logger = new Logger(FileBrowserController.name);

  constructor(private readonly facade: FileBrowserFacade) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get()
  public async getRootFolderContent(): Promise<ResponseObject<FileRecord[]>> {
    return {
      data: (await this.facade.getFolderContent('')) as FileRecord[],
    };
  }

  @Get('*')
  public async getFolderContent(
    @Param() params: { [index: number]: string },
    @Res() response: Response
  ): Promise<ResponseObject<FileRecord[]>> {
    try {
      const content:
        | FileRecord[]
        | ReadStream
        | string = await this.facade.getFolderContent(params[0] || '');
      if (typeof content === 'string') {
        response.sendFile(content);
        return;
      } else if (content instanceof ReadStream) {
        content.pipe(response);
        return;
      } else {
        response.json({ data: content });
      }
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        this.logger.error('Soubor nebyl nalezen!!!');
      }
      // TODO error handling
      this.logger.error(e);
      response.json({ message: { code: MessageCodes.CODE_ERROR } });
    }
  }

  @Put('*')
  public async createNewFolder(
    @Param() params: { [index: number]: string }
  ): Promise<ResponseObject<FileRecord[]>> {
    try {
      const [parentFolder, folderName] = await this.facade.createNewFolder(
        params[0]
      );
      const files = (await this.facade.getFolderContent(
        parentFolder
      )) as FileRecord[];
      return {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_CREATED,
          params: {
            name: folderName,
          },
        },
      };
    } catch (e) {
      if (e instanceof FolderIsUnableToCreateException) {
        const error = e as FolderIsUnableToCreateException;
        this.logger.error(`Složku '${error.path}' není možné vytvořit!`);
      } else if (e instanceof FileAlreadyExistsException) {
        const error = e as FileAlreadyExistsException;
        this.logger.error(`Složka '${error.path}' již existuje!`);
      } else if (e instanceof FileAccessRestrictedException) {
        const error = e as FileAccessRestrictedException;
        this.logger.error(
          `Složku '${error.restrictedPath}' není možné vytvořit mimo povolený prostor!`
        );
      } else if (e instanceof FileNotFoundException) {
        const error = e as FileNotFoundException;
        this.logger.error(`Nadřazená složka '${error.path}' nebyla nalezena!`);
      } else {
        this.logger.error('Nastala neznámá chyba při vytváření nové složky!');
        this.logger.error(e);
      }
      return { message: { code: MessageCodes.CODE_ERROR } };
    }
  }

  @Post('*')
  @UseInterceptors(FilesInterceptor('files[]'))
  public async uploadFiles(
    @UploadedFiles() uploadedFiles: UploadedFileStructure[],
    @Param() param: { [index: number]: string }
  ): Promise<ResponseObject<FileRecord[]>> {
    try {
      await this.facade.uploadFiles(uploadedFiles, param[0]);
      const files = (await this.facade.getFolderContent(
        param[0]
      )) as FileRecord[];
      return {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_UPLOADED,
          params: {
            name: 'unknown' /*this._service.mergePath(...subfolders)*/,
          },
        },
      };
    } catch (e) {
      if (e instanceof FileAccessRestrictedException) {
        const error = e as FileAccessRestrictedException;
        this.logger.error(
          `Soubor '${error.restrictedPath}' není možné nahrát mimo povolený prostor!`
        );
        return {
          message: {
            code: MessageCodes.CODE_ERROR_FILE_BROWSER_FILES_NOT_UPLOADED,
          },
        };
      } else {
        this.logger.error('Nastala neznámá chyba při nahrávání souborů!');
      }
      this.logger.error(e);
      return {
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }

  @Delete('*')
  public async deleteFile(
    @Param() param: { [index: number]: string }
  ): Promise<ResponseObject<FileRecord[]>> {
    try {
      const parentFolder = await this.facade.deleteFile(param[0]);
      const files = (await this.facade.getFolderContent(
        parentFolder
      )) as FileRecord[];
      return {
        data: files,
        message: {
          code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_DELETED,
          params: {
            name: '' /*this._service.mergePath(...subfolders)*/,
          },
        },
      };
    } catch (e) {
      if (e instanceof FileNotFoundException) {
        const error = e as FileNotFoundException;
        this.logger.error(`Soubor '${error.path}' nebyl nalezen!`);
        return {
          data: [],
          message: {
            code: MessageCodes.CODE_ERROR_FILE_BROWSER_FILES_NOT_DELETED,
          },
        };
      } else {
        this.logger.error('Nastala neznámá chyba při mazání souboru!');
      }
      this.logger.error(e);
      return {
        data: [],
        message: {
          code: MessageCodes.CODE_ERROR,
        },
      };
    }
  }
}
