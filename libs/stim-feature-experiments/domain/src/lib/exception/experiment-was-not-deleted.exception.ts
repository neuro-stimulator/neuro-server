import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class ExperimentWasNotDeletedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_DELETED;

  constructor(public readonly experimentID: number, public readonly error?: QueryError) {
    super();
  }
}
