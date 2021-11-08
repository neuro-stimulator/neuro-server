import { BaseError } from '@neuro-server/stim-lib-common';

import { MessageCodes } from '@stechy1/diplomka-share';

export class ExperimentIsNotInitializedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_IS_NOT_INITIALIZED;

  constructor() {
    super();
  }
}
