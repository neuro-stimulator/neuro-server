import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class ExperimentAlreadyExistsError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_ALREADY_EXISTS;
}
