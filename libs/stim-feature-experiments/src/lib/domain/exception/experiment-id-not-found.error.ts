import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class ExperimentIdNotFoundError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_NOT_FOUND;

  constructor(public readonly experimentID: string | number) {
    super();
  }
}
