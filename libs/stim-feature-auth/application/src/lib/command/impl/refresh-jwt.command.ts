import { ICommand } from '@nestjs/cqrs';

export class RefreshJwtCommand implements ICommand {
  constructor(public readonly refreshToken: string, public readonly oldAccessToken: string, public readonly clientId: string, public readonly ipAddress: string) {}
}
