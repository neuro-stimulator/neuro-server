import { ICommand } from '@nestjs/cqrs';

export class OpenCommand implements ICommand {
  constructor(public readonly path: string) {}
}
