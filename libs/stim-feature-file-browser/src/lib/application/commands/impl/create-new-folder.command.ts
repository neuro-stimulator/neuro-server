import { ICommand } from '@nestjs/cqrs';

export class CreateNewFolderCommand implements ICommand {
  constructor(public readonly path: string) {}
}
