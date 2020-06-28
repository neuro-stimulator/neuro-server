import { ExperimentResult, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

import { QueryError } from '../model/query-error';

export class ExperimentResultWasNotUpdatedError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_UPDATED;

  constructor(public readonly experimentResult: ExperimentResult, public readonly error?: QueryError) {
    super();
  }
}
