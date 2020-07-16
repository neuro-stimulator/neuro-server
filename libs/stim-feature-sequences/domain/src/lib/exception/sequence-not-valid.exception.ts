import { MessageCodes, Sequence } from '@stechy1/diplomka-share';

import { BaseError, ValidationErrors } from '@diplomka-backend/stim-lib-common';

export class SequenceNotValidException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_NOT_VALID;

  constructor(public readonly sequence: Sequence, public readonly errors: ValidationErrors) {
    super();
  }
}
