import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class PortIsUnableToOpenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_UNABLE_TO_OPEN;
}
