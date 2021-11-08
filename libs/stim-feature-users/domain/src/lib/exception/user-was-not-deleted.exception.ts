import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class UserWasNotDeletedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_USER_NOT_DELETED;

  constructor(public readonly userID: number, public readonly error?: QueryError) {
    super();
  }
}
