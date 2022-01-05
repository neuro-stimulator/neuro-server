import { ReadStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { FileRecord } from '@stechy1/diplomka-share';

import {
  GetContentQuery,
  ReadPrivateJSONFileQuery,
  MergePublicPathQuery,
  MergePrivatePathQuery,
  CreateNewFolderCommand,
  DeleteFileCommand,
  UploadFilesCommand,
  WritePrivateJSONFileCommand
} from '@neuro-server/stim-feature-file-browser/application';
import { FileLocation, UploadedFileStructure } from '@neuro-server/stim-feature-file-browser/domain';


@Injectable()
export class FileBrowserFacade {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  public async getContent(path: string, location: FileLocation = 'public'): Promise<FileRecord[] | ReadStream | string> {
    return this.queryBus.execute(new GetContentQuery(path, location));
  }

  public async readPrivateJSONFile<T>(path: string): Promise<T> {
    return this.queryBus.execute(new ReadPrivateJSONFileQuery(path));
  }

  public async createNewFolder(path: string, location: FileLocation = 'public', throwExceptionIfExists = true): Promise<[string, string]> {
    return this.commandBus.execute(new CreateNewFolderCommand(path, location, throwExceptionIfExists));
  }

  public async uploadFiles(uploadedFiles: UploadedFileStructure[], path: string): Promise<void> {
    return this.commandBus.execute(new UploadFilesCommand(uploadedFiles, path));
  }

  public async deleteFile(path: string): Promise<string> {
    return this.commandBus.execute(new DeleteFileCommand(path));
  }

  public async mergePublicPath(path: string, exceptionIfNotFound?: boolean): Promise<string> {
    return this.queryBus.execute(new MergePublicPathQuery(path, exceptionIfNotFound));
  }

  public async mergePrivatePath(path: string, exceptionIfNotFound?: boolean): Promise<string> {
    return this.queryBus.execute(new MergePrivatePathQuery(path, exceptionIfNotFound));
  }

  public async writePrivateJSONFile(path: string, content: unknown): Promise<void> {
    return this.commandBus.execute(new WritePrivateJSONFileCommand(path, content));
  }
}
