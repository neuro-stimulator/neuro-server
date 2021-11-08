import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class TokenRefreshFailedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_TOKEN_REFRESH_FAILED;
}
