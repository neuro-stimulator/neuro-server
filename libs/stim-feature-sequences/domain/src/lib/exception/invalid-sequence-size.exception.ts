import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class InvalidSequenceSizeException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_INVALID_SIZE;

  constructor(public readonly sequenceSize: number) {
    super();
  }
}
