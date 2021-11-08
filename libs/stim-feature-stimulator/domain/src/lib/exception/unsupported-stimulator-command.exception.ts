import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class UnsupportedStimulatorCommandException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_STIMULATOR_UNSUPPORTED_COMMAND;

  constructor(public readonly buffer: Buffer) {
    super();
  }
}
