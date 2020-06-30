import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class UnsupportedStimulatorCommandException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_STIMULATOR_UNSUPPORTED_COMMAND;

  constructor(public readonly buffer: Buffer) {
    super();
  }
}
