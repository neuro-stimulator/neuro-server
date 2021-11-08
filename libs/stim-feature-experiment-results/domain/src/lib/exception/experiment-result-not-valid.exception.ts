import { ExperimentResult, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, ValidationErrors } from '@neuro-server/stim-lib-common';

export class ExperimentResultNotValidException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_VALID;

  constructor(public readonly experimentResult: ExperimentResult, public readonly errors: ValidationErrors) {
    super();
  }
}
