import { ICommand } from '@nestjs/cqrs';

export class SaveSerialPathIfNecessaryCommand implements ICommand {
  constructor(public readonly path: string) {}
}
