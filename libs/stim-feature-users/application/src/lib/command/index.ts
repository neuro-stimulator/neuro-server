import { UserDeleteHandler } from './handler/user-delete.handler';
import { UserInsertHandler } from './handler/user-insert.handler';
import { UserUpdateHandler } from './handler/user-update.handler';
import { UserValidateHandler } from './handler/user-validate.handler';
import { RegisterUserHandler } from './handler/register-user.handler';
import { AssignUserRoleHandler } from './handler/assign-user-role.handler';

export const COMMANDS = [AssignUserRoleHandler, UserDeleteHandler, UserInsertHandler, UserUpdateHandler, UserValidateHandler, RegisterUserHandler];
