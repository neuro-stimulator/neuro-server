import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { User } from '@stechy1/diplomka-share';

import { LoginCommand, LogoutCommand, RefreshJwtCommand } from '@neuro-server/stim-feature-auth/application';
import { LoginResponse } from '@neuro-server/stim-feature-auth/domain';

@Injectable()
export class AuthFacade {
  constructor(private readonly commandBus: CommandBus) {}

  public async login(user: User, ipAddress: string, clientID: string): Promise<LoginResponse> {
    return this.commandBus.execute(new LoginCommand(user, ipAddress, clientID));
  }

  public async logout(userUUID: string, clientID: string, refreshToken: string, fromAll: boolean): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(userUUID, clientID, refreshToken, fromAll));
  }

  public async refreshJWT(refreshToken: string, clientID: string, ipAddress: any): Promise<LoginResponse> {
    return this.commandBus.execute(new RefreshJwtCommand(refreshToken, clientID, ipAddress));
  }
}
