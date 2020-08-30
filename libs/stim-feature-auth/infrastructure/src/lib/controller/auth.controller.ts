import { Response } from 'express';
import { Body, Controller, Headers, Ip, Logger, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';

import { User } from '@stechy1/diplomka-share';

import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { JWT, LoginFailedException, LoginResponse, TokenRefreshFailedException, UnauthorizedException, UserData } from '@diplomka-backend/stim-feature-auth/domain';
import { IsAuthorizedGuard } from '@diplomka-backend/stim-feature-auth/application';

import { AuthFacade } from '../service/auth.facade';

@Controller('/api/auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly facade: AuthFacade) {}

  @Post('login')
  public async login(@Ip() ipAddress, @Body() body: User, @Headers('x-client-id') clientID: string, @Res() res: Response): Promise<any> {
    this.logger.log('Přišel požadavek na přihlášení uživatele.');
    try {
      const loginResponse: LoginResponse = await this.facade.login(body, ipAddress, clientID);

      res.cookie('SESSIONID', loginResponse.accessToken, { httpOnly: true, secure: false, expires: loginResponse.expiresIn, sameSite: 'strict' });
      res.cookie('XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' });

      res.json({ data: loginResponse.user });
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        const error = e as UnauthorizedException;
        this.logger.error('Uživatele se nepodařilo přihlásit, protože zadal nesprávné údaje.');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      } else if (e instanceof LoginFailedException) {
        const error = e as LoginFailedException;
        this.logger.error('Přihlašování se nezdařilo!');
        this.logger.error(e.message);
        throw new ControllerException(error.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při přihlašování uživatele.');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('refresh-jwt')
  @UseGuards(IsAuthorizedGuard)
  public async refreshJWT(
    @Ip() ipAddress,
    @Headers('x-client-id') clientID: string,
    @UserData() user: { id: number; refreshToken: string },
    @JWT() jwt: string,
    @Res() res: Response
  ): Promise<any> {
    this.logger.log('Přišel požadavek na obnovení jwt.');
    try {
      const loginResponse: LoginResponse = await this.facade.refreshJWT(user.refreshToken, jwt, clientID, ipAddress);

      res.cookie('SESSIONID', loginResponse.accessToken, { httpOnly: true, secure: false, expires: loginResponse.expiresIn, sameSite: 'strict' });
      res.cookie('XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' });

      res.json({ data: loginResponse.user });
    } catch (e) {
      if (e instanceof TokenRefreshFailedException) {
        const error = e as TokenRefreshFailedException;
        this.logger.error('Refresh token se nepodařilo obnovit!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      }
      this.logger.error('Nastala neočekávaná chyba při obnovování jwt!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Post('logout')
  @UseGuards(IsAuthorizedGuard)
  public async logout(@UserData() user: { id: number; refreshToken: string }, @Query('fromAll') fromAll = false, @Res() res: Response): Promise<any> {
    this.logger.log('Přišel požadavek na odhlášení uživatele.');
    try {
      await this.facade.logout(user.id, user.refreshToken, fromAll);

      res.clearCookie('SESSIONID');
      res.clearCookie('XSRF-TOKEN');

      res.end();
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        const error = e as UnauthorizedException;
        this.logger.error('Neautorizovaný uživatel se snaží odhlásit!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode);
      }
      this.logger.error('Nastala neočekávaná chyba při přihlašování uživatele.');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }
}
