import { LoginHandler } from './handler/login.handler';
import { LogoutHandler } from './handler/logout.handler';
import { RefreshJwtHandler } from './handler/refresh-jwt.handler';

export const CommandHandlers = [LoginHandler, LogoutHandler, RefreshJwtHandler];
