import { ICommand } from '@nestjs/cqrs';

export class DeleteFileCommand implements ICommand {
  constructor(public readonly path: string) {}
}
