import { ICommand } from '@nestjs/cqrs';

import { FileLocation } from '../../../domain/model/file-location';

export class DeleteFileCommand implements ICommand {
  constructor(public readonly path: string, public readonly location: FileLocation = 'public') {}
}
