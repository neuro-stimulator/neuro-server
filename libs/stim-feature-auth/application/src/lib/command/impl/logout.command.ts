import { ICommand } from '@nestjs/cqrs';

export class LogoutCommand implements ICommand {
  constructor(public readonly userID: number, public readonly refreshToken: string, public readonly fromAll: boolean) {}
}
