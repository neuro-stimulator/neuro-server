import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class LoginFailedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_LOGIN_FAILED;
}
