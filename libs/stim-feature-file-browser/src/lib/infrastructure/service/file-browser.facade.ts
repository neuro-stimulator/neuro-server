import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FileRecord } from '@stechy1/diplomka-share';
import { ReadStream } from 'fs';
import {
  CreateNewFolderCommand,
  UploadFilesCommand,
  DeleteFileCommand,
} from '../../application/commands';
import { UploadedFileStructure } from '../../domain/model/uploaded-file-structure';
import { GetContentQuery } from '../../application/queries';

@Injectable()
export class FileBrowserFacade {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  public async getFolderContent(
    path: string
  ): Promise<FileRecord[] | ReadStream | string> {
    return this.queryBus.execute(new GetContentQuery(path));
  }

  public async createNewFolder(path: string): Promise<[string, string]> {
    return this.commandBus.execute(new CreateNewFolderCommand(path));
  }

  public async uploadFiles(
    uploadedFiles: UploadedFileStructure[],
    path: string
  ): Promise<void> {
    return this.commandBus.execute(new UploadFilesCommand(uploadedFiles, path));
  }

  public async deleteFile(path: string): Promise<string> {
    return this.commandBus.execute(new DeleteFileCommand(path));
  }
}
