import { JwtPayload as OriginalJwtPayload } from 'jsonwebtoken';

import { UserGroups } from '@stechy1/diplomka-share';

export interface JwtPayload extends OriginalJwtPayload {
  userGroups: UserGroups
}
