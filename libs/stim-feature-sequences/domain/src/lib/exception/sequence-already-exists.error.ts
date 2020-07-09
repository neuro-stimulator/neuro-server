import { BaseError } from '@diplomka-backend/stim-lib-common';
import { MessageCodes } from '@stechy1/diplomka-share';

export class SequenceAlreadyExistsError extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_SEQUENCE_ALREADY_EXISTS;
}
