import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class IpcAlreadyOpenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_ALREADY_OPEN;
}
