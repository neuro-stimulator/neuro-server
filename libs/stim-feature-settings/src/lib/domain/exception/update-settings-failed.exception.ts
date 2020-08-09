import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class UpdateSettingsFailedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SETTINGS_NOT_UPDATED;
}
