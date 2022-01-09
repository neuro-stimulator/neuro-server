import { ICommand } from '@nestjs/cqrs';

export class WritePrivateJSONFileCommand implements ICommand {
  constructor(public readonly path: string, public readonly data: unknown) {}
}
