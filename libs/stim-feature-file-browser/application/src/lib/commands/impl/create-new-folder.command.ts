import { ICommand } from '@nestjs/cqrs';

import { FileLocation } from '@neuro-server/stim-feature-file-browser/domain';

export class CreateNewFolderCommand implements ICommand {
  constructor(public readonly path: string, public readonly location: FileLocation = 'public', public readonly throwExceptionIfExists: boolean = true) {}
}
