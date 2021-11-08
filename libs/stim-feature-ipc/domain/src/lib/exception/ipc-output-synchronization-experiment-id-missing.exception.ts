import { BaseError } from '@neuro-server/stim-lib-common';

import { MessageCodes } from '@stechy1/diplomka-share';

export class IpcOutputSynchronizationExperimentIdMissingException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_IPC_SYNC_EXPERIMENT_ID_MISSING;
}
