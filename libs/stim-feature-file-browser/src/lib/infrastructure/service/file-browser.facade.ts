import { ReadStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FileRecord } from '@stechy1/diplomka-share';

import { UploadedFileStructure } from '../../domain/model/uploaded-file-structure';
import { FileLocation } from '../../domain/model/file-location';
import { GetContentQuery } from '../../application/queries/impl/get-content.query';
import { ReadPrivateJSONFileQuery } from '../../application/queries/impl/read-private-json-file.query';
import { MergePublicPathQuery } from '../../application/queries/impl/merge-public-path.query';
import { MergePrivatePathQuery } from '../../application/queries/impl/merge-private-path.query';
import { CreateNewFolderCommand } from '../../application/commands/impl/create-new-folder.command';
import { DeleteFileCommand } from '../../application/commands/impl/delete-file.command';
import { UploadFilesCommand } from '../../application/commands/impl/upload-files.command';
import { WritePrivateJSONFileCommand } from '../../application/commands/impl/write-private-json-file.command';

@Injectable()
export class FileBrowserFacade {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  public async getContent(path: string, location: FileLocation = 'public'): Promise<FileRecord[] | ReadStream | string> {
    return this.queryBus.execute(new GetContentQuery(path, location));
  }

  public async readPrivateJSONFile<T>(path: string): Promise<T> {
    return this.queryBus.execute(new ReadPrivateJSONFileQuery(path));
  }

  public async createNewFolder(path: string, location: FileLocation = 'public'): Promise<[string, string]> {
    return this.commandBus.execute(new CreateNewFolderCommand(path, location));
  }

  public async uploadFiles(uploadedFiles: UploadedFileStructure[], path: string): Promise<void> {
    return this.commandBus.execute(new UploadFilesCommand(uploadedFiles, path));
  }

  public async deleteFile(path: string): Promise<string> {
    return this.commandBus.execute(new DeleteFileCommand(path));
  }

  public async mergePublicPath(path: string, exceptionIfNotFound?: boolean) {
    return this.queryBus.execute(new MergePublicPathQuery(path, exceptionIfNotFound));
  }

  public async mergePrivatePath(path: string, exceptionIfNotFound?: boolean) {
    return this.queryBus.execute(new MergePrivatePathQuery(path, exceptionIfNotFound));
  }

  public async writePrivateJSONFile(path: string, content: any) {
    return this.commandBus.execute(new WritePrivateJSONFileCommand(path, content));
  }
}
