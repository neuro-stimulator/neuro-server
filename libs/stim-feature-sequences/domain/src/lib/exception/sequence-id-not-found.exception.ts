import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';

export class SequenceIdNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND;

  constructor(public readonly sequenceID: string | number, public readonly error?: QueryError) {
    super();
  }
}
