import { Request } from 'express';

import { User } from '@stechy1/diplomka-share';

export interface RequestWithUser extends Request {
  user?: Partial<User>;
  refreshToken?: string;
}
