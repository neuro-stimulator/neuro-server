import { MessageCodes } from '@stechy1/diplomka-share';
import { BaseError } from './base-error';

export class ControllerException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly code: number = MessageCodes.CODE_ERROR, public readonly params?: {}) {
    super();
  }
}
