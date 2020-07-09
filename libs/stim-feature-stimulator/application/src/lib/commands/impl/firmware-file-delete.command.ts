import { ICommand } from '@nestjs/cqrs';

export class FirmwareFileDeleteCommand implements ICommand {
  constructor(public readonly path: string) {}
}
