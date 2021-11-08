import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class UnauthorizedException extends BaseError {
  constructor(public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_UNAUTHORIZED) {
    super();
  }
}
