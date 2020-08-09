import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class ExperimentDoNotSupportSequencesException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_EXPERIMENT_DO_NOT_SUPPORT_SEQUENCES;

  constructor(public readonly experimentID: number) {
    super();
  }
}
