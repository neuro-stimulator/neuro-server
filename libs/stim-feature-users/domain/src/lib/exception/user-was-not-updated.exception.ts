import { MessageCodes, User } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';

export class UserWasNotUpdatedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_USER_NOT_UPDATED;

  constructor(public readonly user: User, public readonly error?: QueryError) {
    super();
  }
}
