import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class PortIsNotOpenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_NOT_OPEN;
}
