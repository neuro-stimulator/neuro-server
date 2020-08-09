import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class FileAlreadyExistsException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ALREADY_EXISTS;

  constructor(public readonly path: string) {
    super();
  }
}
