import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class FileNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_NOT_FOUND;

  constructor(public readonly path: string) {
    super();
  }
}
