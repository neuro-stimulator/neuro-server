import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class UnknownStimulatorActionTypeException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_STIMULATOR_UNKNOWN_ACTION;

  constructor(public readonly action: string) {
    super();
  }
}
