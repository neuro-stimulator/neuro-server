import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class UpdateSettingsFailedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SETTINGS_NOT_UPDATED;
}
