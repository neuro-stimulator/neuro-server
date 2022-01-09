import { ICommand } from '@nestjs/cqrs';

import { FileLocation } from '@neuro-server/stim-feature-file-browser/domain';

export class DeleteFileCommand implements ICommand {
  constructor(public readonly path: string, public readonly location: FileLocation = 'public') {}
}
