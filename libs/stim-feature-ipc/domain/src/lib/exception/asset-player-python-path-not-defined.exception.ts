import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class AssetPlayerPythonPathNotDefinedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_PYTHON_PATH_NOT_DEFINED;
}
