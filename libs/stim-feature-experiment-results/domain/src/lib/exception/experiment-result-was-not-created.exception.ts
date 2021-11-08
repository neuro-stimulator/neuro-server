import { ExperimentResult, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class ExperimentResultWasNotCreatedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_WAS_NOT_CREATED;

  constructor(public readonly experimentResult: ExperimentResult, public readonly error?: QueryError) {
    super();
  }
}
