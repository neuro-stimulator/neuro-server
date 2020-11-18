import { ICommand } from '@nestjs/cqrs';

import { UploadedFileStructure } from '../../../domain/model/uploaded-file-structure';

export class UploadFilesCommand implements ICommand {
  constructor(public readonly uploadedFiles: UploadedFileStructure[], public readonly path: string) {}
}
