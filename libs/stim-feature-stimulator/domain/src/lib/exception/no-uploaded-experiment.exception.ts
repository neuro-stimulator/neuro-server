import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class NoUploadedExperimentException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_STIMULATOR_NO_UPLOADED_EXPERIMENT;
}
