import { Body, Controller, Get, Logger, Patch, Post, Query } from '@nestjs/common';

import { MessageCodes, ResponseObject, User } from '@stechy1/diplomka-share';

import { ControllerException } from '@neuro-server/stim-lib-common';
import { UserIdNotFoundException, UserNotValidException, UserWasNotRegistredException, UserWasNotUpdatedException } from '@neuro-server/stim-feature-users/domain';

import { UsersFacade } from '../service/users.facade';

@Controller('/api/users')
export class UsersController {
  private readonly logger: Logger = new Logger(UsersController.name);

  constructor(private readonly facade: UsersFacade) {}

  @Post('register')
  public async register(@Body() user: User): Promise<ResponseObject<void>> {
    this.logger.log('Přišel požadavek na registraci nového uživatele.');
    try {
      await this.facade.register(user);
      return {};
    } catch (e) {
      if (e instanceof UserNotValidException) {
        this.logger.error('Uživatel není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof UserWasNotRegistredException) {
        this.logger.error('Uživatele se nepodařilo zaregistrovat!');
        this.logger.error(e.error);
        throw new ControllerException(e.errorCode, { user: e.user });
      } else {
        this.logger.error('Nastala neočekávaná chyba při registraci uživatele!');
        this.logger.error(e);
      }
      throw new ControllerException();
    }
  }

  @Patch()
  public async update(@Body() body: User): Promise<ResponseObject<User>> {
    this.logger.log('Přišel požadavek na aktualizaci informaci o uživateli.');
    try {
      await this.facade.update(body);
      const user: User = await this.facade.userById(body.id);
      return {
        data: user,
        message: {
          code: MessageCodes.CODE_SUCCESS,
          params: {
            id: user.id,
          },
        },
      };
    } catch (e) {
      if (e instanceof UserNotValidException) {
        this.logger.error('Aktualizovaný uživatel není validní!');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, (e.errors as unknown) as Record<string, unknown>);
      } else if (e instanceof UserIdNotFoundException) {
        this.logger.error('Uživatel nebyl nalezen.');
        this.logger.error(e);
        throw new ControllerException(e.errorCode, { id: e.userID });
      } else if (e instanceof UserWasNotUpdatedException) {
        this.logger.error('Uživatele se nepodařilo aktualizovat!');
        if (e.error) {
          this.logger.error(e.error);
        }
        throw new ControllerException(e.errorCode, { id: e.user.id });
      } else {
        this.logger.error('Uživatele se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }

  @Get()
  public async getUsers(@Query('groups') groupsRaw: string): Promise<ResponseObject<User[]>> {
    this.logger.log('Přišel požadavek na získání všech uživatelů v zadané skupině.');
    try {
      const groups: number[] = groupsRaw.split(',').map(value => parseInt(value));
      const users: User[] = await this.facade.usersByGroup(groups);
      return {
        data: users
      }
    } catch (e) {
      this.logger.error('Nastala neočekávaná chyba při získávání všech uživatelů v zadané skupině!');
      this.logger.error(e);
      throw new ControllerException();
    }
  }
}
