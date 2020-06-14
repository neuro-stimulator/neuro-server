import {
  Controller,
  Delete,
  Get,
  Options,
  Param,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  FileRecord,
  MessageCodes,
  ResponseObject,
} from '@stechy1/diplomka-share';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetContentQuery } from 'libs/stim-feature-file-browser/src/lib/cqrs/queries/impl';

// import { UploadedFileStructure } from "apps/server/src/app/share/utils";

@Controller('api/file-browser')
export class StimFeatureFileBrowserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Options('')
  public async optionsEmpty() {
    return '';
  }

  @Options('*')
  public async optionsWildcard() {
    return '';
  }

  @Get('*')
  public async getFolderContent(
    @Param() param: string[],
    @Res() response: Response
  ): Promise<ResponseObject<FileRecord[]>> {
    return this.queryBus.execute(new GetContentQuery(param));
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
  }

  @Put('*')
  public async createNewFolder(
    @Param() param: string[]
  ): Promise<ResponseObject<FileRecord[]>> {
    // const subfolders = param[0].split('/');
    // const originalSubfolders = subfolders.slice(0, subfolders.length - 1);
    //
    // try {
    //   const subfolderPath = this._service.mergePublicPath(...subfolders);
    //   const originalSubfolderPath = await this._service.mergePublicPath(... originalSubfolders);
    //   await this._service.createDirectory(subfolderPath, true);
    //   const files = await this._service.getFilesFromDirectory(originalSubfolderPath);
    //
    //   return {
    //     data: files,
    //     message: {
    //       code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_CREATED,
    //       params: {
    //         name: this._service.mergePath(...subfolders)
    //       }
    //     }
    //   };
    //
    // } catch (e) {
    //   return { message: { code: MessageCodes.CODE_ERROR } };
    // }
  }

  @Post('*')
  @UseInterceptors(FilesInterceptor('files[]'))
  public async uploadFiles(
    @UploadedFiles() uploadedFiles /*: UploadedFileStructure[]*/,
    @Param() param: string[]
  ): Promise<ResponseObject<FileRecord[]>> {
    // const subfolders = param[0].split('/');
    //
    // try {
    //   await this._service.saveFiles(uploadedFiles, param[0]);
    //   const subfolderPath = this._service.mergePublicPath(...subfolders);
    //   const files = await this._service.getFilesFromDirectory(subfolderPath);
    //
    //   return {
    //     data: files,
    //     message: {
    //       code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_UPLOADED,
    //       params: {
    //         name: this._service.mergePath(...subfolders)
    //       }
    //     }
    //   };
    //
    // } catch (e) {
    //   return { message: { code: MessageCodes.CODE_ERROR_FILE_BROWSER_FILES_NOT_UPLOADED } };
    // }
  }

  @Delete('*')
  public async deleteFile(
    @Param() param: string[]
  ): Promise<ResponseObject<FileRecord[]>> {
    // const subfolders = param[0].split('/');
    // const subfolderPath = this._service.mergePublicPath(...subfolders);
    // const parentSubfolders = subfolders.length >= 1 ? subfolders.slice(0, subfolders.length - 1) : subfolders;
    // const parentPath = this._service.mergePublicPath(...parentSubfolders);
    //
    // try {
    //   this._service.recursiveDelete(subfolderPath);
    //   const files = await this._service.getFilesFromDirectory(parentPath);
    //
    //   return {
    //     data: files,
    //     message: {
    //       code: MessageCodes.CODE_SUCCESS_FILE_BROWSER_FILES_DELETED,
    //       params: {
    //         name: this._service.mergePath(...subfolders)
    //       }
    //     }
    //   };
    //
    // } catch (e) {
    //   return { data: [], message: { code: MessageCodes.CODE_ERROR_FILE_BROWSER_FILES_NOT_DELETED } };
    // }
  }
}
