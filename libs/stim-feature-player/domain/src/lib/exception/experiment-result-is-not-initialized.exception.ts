import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class ExperimentResultIsNotInitializedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_PLAYER_EXPERIMENT_RESULT_IS_NOT_INITIALIZED;

  constructor() {
    super();
  }
}
