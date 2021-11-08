import { Experiment, MessageCodes, Output } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class ExperimentWasNotUpdatedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_WAS_NOT_UPDATED;

  constructor(public readonly experiment: Experiment<Output>, public readonly error?: QueryError) {
    super();
  }
}
