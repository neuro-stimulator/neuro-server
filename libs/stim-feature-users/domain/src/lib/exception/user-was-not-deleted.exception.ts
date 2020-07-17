import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';

export class UserWasNotDeletedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly userID: number, public readonly error?: QueryError) {
    super();
  }
}
