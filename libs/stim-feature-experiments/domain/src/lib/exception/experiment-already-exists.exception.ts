import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class ExperimentAlreadyExistsException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_ALREADY_EXISTS;
}
