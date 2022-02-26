import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class IpcOutputSynchronizationExperimentIdMissingException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_SYNC_EXPERIMENT_ID_MISSING;
}
