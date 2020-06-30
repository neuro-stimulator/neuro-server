import { QueryError } from '../model/query-error';
import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class SequenceWasNotDeletedError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_NOT_DELETED;

  constructor(public readonly sequenceID: number, public readonly error?: QueryError) {
    super();
  }
}
