import { QueryError } from '../model/query-error';
import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class ExperimentWasNotDeletedError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_DELETED;

  constructor(public readonly experimentID: number, public readonly error?: QueryError) {
    super();
  }
}
