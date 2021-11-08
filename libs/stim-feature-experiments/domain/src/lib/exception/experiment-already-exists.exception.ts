import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class ExperimentAlreadyExistsException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_ALREADY_EXISTS;
}
