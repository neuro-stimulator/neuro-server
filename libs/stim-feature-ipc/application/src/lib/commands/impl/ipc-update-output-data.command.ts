import { ICommand } from '@nestjs/cqrs';

export class IpcUpdateOutputDataCommand implements ICommand {
  constructor(public readonly id: number, public readonly type: 'image' | 'audio', public readonly x: number, public readonly y: number) {}
}
