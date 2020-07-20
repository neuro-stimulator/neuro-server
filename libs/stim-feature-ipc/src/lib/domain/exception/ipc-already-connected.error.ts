import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class IpcAlreadyConnectedError extends BaseError {
  public readonly errorCode = MessageCodes.ERROR_CODE_IPC_ALREADY_CONNECTED;
}
