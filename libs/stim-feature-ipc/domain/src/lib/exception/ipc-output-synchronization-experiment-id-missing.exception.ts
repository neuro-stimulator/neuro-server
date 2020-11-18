import { BaseError } from '@diplomka-backend/stim-lib-common';

import { MessageCodes } from '@stechy1/diplomka-share';

export class IpcOutputSynchronizationExperimentIdMissingException extends BaseError {
  errorCode = MessageCodes.CODE_ERROR;
}
