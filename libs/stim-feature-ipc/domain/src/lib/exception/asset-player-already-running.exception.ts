import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class AssetPlayerAlreadyRunningException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_PLAYER_ALREADY_RUNNING;
}
