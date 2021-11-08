import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class ExperimentResultWasNotDeletedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_DELETED;

  constructor(public readonly experimentResultID: number, public readonly error?: QueryError) {
    super();
  }
}
