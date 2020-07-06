import { MessageCodes, Sequence } from '@stechy1/diplomka-share';

import { QueryError } from '../model/query-error';
import { BaseError } from '@diplomka-backend/stim-lib-common';

export class SequenceWasNotUpdatedError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_NOT_UPDATED;

  constructor(public readonly sequence: Sequence, public readonly error?: QueryError) {
    super();
  }
}
