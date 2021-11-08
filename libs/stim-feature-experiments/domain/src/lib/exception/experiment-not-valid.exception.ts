import { Experiment, MessageCodes, Output } from '@stechy1/diplomka-share';

import { BaseError, ValidationErrors } from '@neuro-server/stim-lib-common';

export class ExperimentNotValidException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_NOT_VALID;

  constructor(public readonly experiment: Experiment<Output>, public readonly errors: ValidationErrors) {
    super();
  }
}
