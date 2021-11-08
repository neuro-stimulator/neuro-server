import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class TokenNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_TOKEN_NOT_FOUND;

  constructor(public readonly refreshToken: string) {
    super();
  }
}
