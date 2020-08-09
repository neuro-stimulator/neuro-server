import { ExperimentResult, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@diplomka-backend/stim-lib-common';

export class ExperimentResultWasNotUpdatedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_UPDATED;

  constructor(public readonly experimentResult: ExperimentResult, public readonly error?: QueryError) {
    super();
  }
}
