import { ICommand } from '@nestjs/cqrs';

export class FirmwareUpdateCommand implements ICommand {
  constructor(public readonly path: string) {}
}
