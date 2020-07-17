import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes, User } from '@stechy1/diplomka-share';

export class UserWasNotCreatedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly user: User, public readonly error?: QueryError) {
    super();
  }
}
