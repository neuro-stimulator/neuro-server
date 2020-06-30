import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class FirmwareUpdateFailedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_STIMULATOR_FIRMWARE_NOT_UPDATED;
}
