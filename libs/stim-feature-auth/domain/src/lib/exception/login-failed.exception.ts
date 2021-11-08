import { BaseError } from '@neuro-server/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class LoginFailedException extends BaseError {
  constructor(public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_LOGIN_FAILED) {
    super();
  }
}
