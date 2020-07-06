import { Experiment, MessageCodes } from '@stechy1/diplomka-share';

import { QueryError } from '../model/query-error';
import { BaseError } from '@diplomka-backend/stim-lib-common';

export class ExperimentWasNotUpdatedError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_UPDATED;

  constructor(public readonly experiment: Experiment, public readonly error?: QueryError) {
    super();
  }
}
