import { BaseError } from '@diplomka-backend/stim-lib-common';

import { MessageCodes } from '@stechy1/diplomka-share';

export class NoIpcOpenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_NOT_OPEN;
}
