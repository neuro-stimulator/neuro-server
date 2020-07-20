import { MessageCodes, User } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';

export class UserWasNotRegistredException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly user: User, public readonly error?: QueryError) {
    super();
  }
}
