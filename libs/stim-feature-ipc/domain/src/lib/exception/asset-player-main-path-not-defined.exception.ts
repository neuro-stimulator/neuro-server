import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class AssetPlayerMainPathNotDefinedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_MAIN_PATH_NOT_DEFINED;
}
