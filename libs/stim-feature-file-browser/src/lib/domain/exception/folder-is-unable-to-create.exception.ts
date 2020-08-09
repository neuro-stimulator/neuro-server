import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class FolderIsUnableToCreateException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_SUCCESS_FILE_BROWSER_DIRECTORY_NOT_CREATED;

  constructor(public readonly path: string) {
    super();
  }
}
