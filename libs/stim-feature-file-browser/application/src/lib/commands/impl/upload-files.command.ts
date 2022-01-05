import { ICommand } from '@nestjs/cqrs';

import { UploadedFileStructure } from '@neuro-server/stim-feature-file-browser/domain';

export class UploadFilesCommand implements ICommand {
  constructor(public readonly uploadedFiles: UploadedFileStructure[], public readonly path: string) {}
}
