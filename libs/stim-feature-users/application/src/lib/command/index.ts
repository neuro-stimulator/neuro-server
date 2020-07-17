import { UserDeleteHandler } from './handler/user-delete.handler';
import { UserInsertHandler } from './handler/user-insert.handler';
import { UserUpdateHandler } from './handler/user-update.handler';
import { UserValidateHandler } from './handler/user-validate.handler';
import { RegisterUserHandler } from './handler/register-user.handler';

export const CommandHandlers = [UserDeleteHandler, UserInsertHandler, UserUpdateHandler, UserValidateHandler, RegisterUserHandler];
