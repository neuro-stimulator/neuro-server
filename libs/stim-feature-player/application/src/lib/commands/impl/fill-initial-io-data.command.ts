import { ICommand } from '@nestjs/cqrs';

export class FillInitialIoDataCommand implements ICommand {
  constructor(public readonly timestamp: number) {}
}
