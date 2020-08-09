import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';

export class SequenceWasNotDeletedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_NOT_DELETED;

  constructor(public readonly sequenceID: number, public readonly error?: QueryError) {
    super();
  }
}
