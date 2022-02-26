import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class ExperimentIsNotInitializedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_IS_NOT_INITIALIZED;

  constructor() {
    super();
  }
}
