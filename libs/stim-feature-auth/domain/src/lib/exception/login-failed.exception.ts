import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class LoginFailedException extends BaseError {
  constructor(public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_LOGIN_FAILED) {
    super();
  }
}
