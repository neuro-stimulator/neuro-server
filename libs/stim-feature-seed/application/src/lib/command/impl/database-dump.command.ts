import { ICommand } from '@nestjs/cqrs';

export class DatabaseDumpCommand implements ICommand {
  constructor(public readonly outputDirectory: string) {}
}
