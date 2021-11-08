import { Response } from 'express';
import { Body, Controller, Headers, HttpStatus, Ip, Logger, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';

import { ResponseObject, User } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { LoginFailedException, LoginResponse, RefreshToken, TokenRefreshed, TokenRefreshFailedException, UnauthorizedException, UserData } from '@neuro-server/stim-feature-auth/domain';
import { IsAuthorizedGuard } from '@neuro-server/stim-feature-auth/application';

import { AuthFacade } from '../service/auth.facade';

@Controller('/api/auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);

  constructor(private readonly facade: AuthFacade) {}

  @Post('login')
  public async login(
    @Ip() ipAddress: string,
    @Body() body: User,
    @Headers('x-client-id') clientID: string,
    @Res({ passthrough: true }) res: Response): Promise<ResponseObject<User>> {
    this.logger.log('Přišel požadavek na přihlášení uživatele.');
    try {
      const loginResponse: LoginResponse = await this.facade.login(body, ipAddress, clientID);

      res.cookie('SESSIONID', loginResponse.accessToken, { httpOnly: true, secure: false, expires: loginResponse.expiresIn, sameSite: 'strict' });
      res.cookie('XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' });

      res.statusCode = HttpStatus.OK;
      return {
        data: loginResponse.user
      };
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        this.logger.error('Uživatele se nepodařilo přihlásit, protože zadal nesprávné údaje.');
        this.logger.error(e);
        throw e;
      } else if (e instanceof LoginFailedException) {
        this.logger.error('Přihlašování se nezdařilo!');
        this.logger.error(e.message);
        throw new UnauthorizedException(e.errorCode);
      } else {
        this.logger.error('Nastala neočekávaná chyba při přihlašování uživatele.');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Patch('refresh-jwt')
  public async refreshJWT(
    @Ip() ipAddress,
    @Headers('x-client-id') clientID: string,
    @RefreshToken() refreshToken: string,
    @TokenRefreshed() tokenRefreshed: boolean,
    @Res({ passthrough: true }) res: Response,
    @UserData() user?: User
  ): Promise<ResponseObject<User>> {
    this.logger.log('Přišel požadavek na obnovení jwt.');
    if (tokenRefreshed) {
      this.logger.log('JWT již byl obnoven v AuthGuard. Není vyžadována žádná další akce.');
      return {
        data: user
      }
    }

    try {
      const loginResponse: LoginResponse = await this.facade.refreshJWT(refreshToken, clientID, ipAddress);

      res.cookie('SESSIONID', loginResponse.accessToken, { httpOnly: true, secure: false, expires: loginResponse.expiresIn, sameSite: 'strict' });
      res.cookie('XSRF-TOKEN', loginResponse.refreshToken, { sameSite: 'strict' });

      return {
        data: loginResponse.user
      };
    } catch (e) {
      if (e instanceof TokenRefreshFailedException) {
        this.logger.error('Refresh token se nepodařilo obnovit!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      }
      this.logger.error('Nastala neočekávaná chyba při obnovování jwt!');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }

  @Post('logout')
  @UseGuards(IsAuthorizedGuard)
  public async logout(
    @UserData() user: User,
    @RefreshToken() refreshToken: string,
    @Headers('x-client-id') clientID: string,
    @Res() res: Response,
    @Query('fromAll') fromAll = false): Promise<any> {
    this.logger.log('Přišel požadavek na odhlášení uživatele.');
    try {
      await this.facade.logout(user.uuid, clientID, refreshToken, fromAll);

      res.clearCookie('SESSIONID');
      res.clearCookie('XSRF-TOKEN');

      res.statusCode = 200;
      res.end();
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        this.logger.error('Neautorizovaný uživatel se snaží odhlásit!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode);
      }
      this.logger.error('Nastala neočekávaná chyba při přihlašování uživatele.');
      this.logger.error(e.message);
      throw new ControllerException();
    }
  }
}
