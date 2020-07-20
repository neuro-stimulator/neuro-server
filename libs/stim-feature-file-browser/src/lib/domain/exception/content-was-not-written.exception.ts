import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class ContentWasNotWrittenException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_WAS_NOT_WRITTEN;

  constructor(public readonly path: string, public readonly content: any) {
    super();
  }
}
