import { ReadStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FileRecord } from '@stechy1/diplomka-share';

import {
  CreateNewFolderCommand,
  UploadFilesCommand,
  DeleteFileCommand,
  WritePrivateJSONFileCommand,
} from '../../application/commands';
import { UploadedFileStructure } from '../../domain/model/uploaded-file-structure';
import {
  GetContentQuery,
  MergePrivatePathQuery,
  MergePublicPathQuery,
  ReadPrivateJSONFileQuery,
} from '../../application/queries';

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

  public async readPrivateJSONFile<T>(path: string): Promise<T> {
    return this.queryBus.execute(new ReadPrivateJSONFileQuery(path));
  }

  public async createNewFolder(
    path: string,
    location: 'public' | 'private' = 'public'
  ): Promise<[string, string]> {
    return this.commandBus.execute(new CreateNewFolderCommand(path, location));
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

  public async mergePublicPath(path: string, exceptionIfNotFound?: boolean) {
    return this.queryBus.execute(
      new MergePublicPathQuery(path, exceptionIfNotFound)
    );
  }

  public async mergePrivatePath(path: string, exceptionIfNotFound?: boolean) {
    return this.queryBus.execute(
      new MergePrivatePathQuery(path, exceptionIfNotFound)
    );
  }

  async writePrivateJSONFile(path: string, content: any) {
    return this.commandBus.execute(
      new WritePrivateJSONFileCommand(path, content)
    );
  }
}
