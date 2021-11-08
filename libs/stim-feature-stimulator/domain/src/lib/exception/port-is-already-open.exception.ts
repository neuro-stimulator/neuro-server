import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class PortIsAlreadyOpenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_LOW_LEVEL_PORT_ALREADY_OPEN;
}
