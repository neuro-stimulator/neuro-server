import { ICommand } from '@nestjs/cqrs';

export class ReadPrivateJSONFileQuery implements ICommand {
  constructor(public readonly path: string) {}
}
