import { QueryError } from '../model/query-error';
import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class SequenceIdNotFoundError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_NOT_FOUND;

  constructor(public readonly sequenceID: string | number, public readonly error?: QueryError) {
    super();
  }
}
