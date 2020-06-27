import { MessageCodes } from '@stechy1/diplomka-share';

export class ControllerException extends Error {
  constructor(public readonly code: number = MessageCodes.CODE_ERROR, public readonly params?: {}) {
    super();
  }
}
