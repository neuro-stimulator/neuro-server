import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class ExperimentResultAlreadyExistsException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_ALREADY_EXISTS;
}
