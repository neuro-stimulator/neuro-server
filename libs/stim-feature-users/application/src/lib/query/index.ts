import { UserByEmailPasswordHandler } from './handler/user-by-email-password.handler';
import { UserByIdHandler } from './handler/user-by-id.handler';
import { UsersByGroupHandler } from './handler/users-by-group.handler';

export const QUERIES = [UserByEmailPasswordHandler, UserByIdHandler, UsersByGroupHandler];
