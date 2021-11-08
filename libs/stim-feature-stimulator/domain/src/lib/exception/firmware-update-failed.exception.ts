import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class FirmwareUpdateFailedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_STIMULATOR_FIRMWARE_NOT_UPDATED;
}
