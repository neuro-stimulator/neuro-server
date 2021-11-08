import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class FileAccessRestrictedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_FILE_BROWSER_FILE_ACCESS_RESTRICTED;

  constructor(public readonly restrictedPath: string) {
    super();
  }
}
