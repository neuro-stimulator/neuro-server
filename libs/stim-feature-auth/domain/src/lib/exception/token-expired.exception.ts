import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class TokenExpiredException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_TOKEN_EXPIRED;
}
