import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class ExperimentResultIdNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_EXPERIMENT_RESULT_NOT_FOUND;

  constructor(public readonly experimentResultID: number) {
    super();
  }
}
