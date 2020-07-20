import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class UserIdNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly userID: number) {
    super();
  }
}
