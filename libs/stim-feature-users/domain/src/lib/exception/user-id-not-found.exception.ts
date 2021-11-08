import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class UserIdNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_USER_ID_NOT_FOUND;

  constructor(public readonly userID: number) {
    super();
  }
}
