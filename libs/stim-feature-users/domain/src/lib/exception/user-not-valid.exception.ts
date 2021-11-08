import { MessageCodes, User } from '@stechy1/diplomka-share';

import { BaseError, ValidationErrors } from '@neuro-server/stim-lib-common';

export class UserNotValidException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_USER_NOT_VALID;

  constructor(public readonly user: User, public readonly errors: ValidationErrors) {
    super();
  }
}
