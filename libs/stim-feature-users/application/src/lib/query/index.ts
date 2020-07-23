import { UserByEmailPasswordHandler } from './handler/user-by-email-password.handler';
import { UserByIdHandler } from './handler/user-by-id.handler';

export const QueryHandlers = [UserByEmailPasswordHandler, UserByIdHandler];
