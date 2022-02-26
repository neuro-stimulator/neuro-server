import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class NoIpcOpenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_NOT_OPEN;
}
