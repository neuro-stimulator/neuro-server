import { Experiment, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, ValidationErrors } from '@diplomka-backend/stim-lib-common';

export class ExperimentNotValidException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID;

  constructor(public readonly experiment: Experiment, public readonly errors: ValidationErrors) {
    super();
  }
}
