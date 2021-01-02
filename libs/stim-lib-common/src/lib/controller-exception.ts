import { MessageCodes } from '@stechy1/diplomka-share';
import { BaseError } from './base-error';

export class ControllerException extends BaseError {
  constructor(public readonly errorCode: number = MessageCodes.CODE_ERROR, public readonly params?: Record<string, unknown>) {
    super();
  }
}
