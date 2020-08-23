import { Body, Controller, Logger, Patch, Post } from '@nestjs/common';
import { UsersFacade } from '../service/users.facade';
import { MessageCodes, ResponseObject, User } from '@stechy1/diplomka-share';
import { ControllerException } from '@diplomka-backend/stim-lib-common';
import { UserIdNotFoundException, UserNotValidException, UserWasNotRegistredException, UserWasNotUpdatedException } from '@diplomka-backend/stim-feature-users/domain';

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
        const error = e as UserNotValidException;
        this.logger.error('Uživatel není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, error.errors);
      } else if (e instanceof UserWasNotRegistredException) {
        const error = e as UserWasNotRegistredException;
        this.logger.error('Uživatele se nepodařilo zaregistrovat!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { user: error.user });
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
        const error = e as UserNotValidException;
        this.logger.error('Aktualizovaný uživatel není validní!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, error.errors);
      } else if (e instanceof UserIdNotFoundException) {
        const error = e as UserIdNotFoundException;
        this.logger.warn('Uživatel nebyl nalezen.');
        this.logger.warn(error);
        throw new ControllerException(error.errorCode, { id: error.userID });
      } else if (e instanceof UserWasNotUpdatedException) {
        const error = e as UserWasNotUpdatedException;
        this.logger.error('Uživatele se nepodařilo aktualizovat!');
        this.logger.error(error);
        throw new ControllerException(error.errorCode, { id: error.user.id });
      } else {
        this.logger.error('Uživatele se nepodařilo aktualizovat z neznámého důvodu!');
        this.logger.error(e.message);
      }
      throw new ControllerException();
    }
  }
}
