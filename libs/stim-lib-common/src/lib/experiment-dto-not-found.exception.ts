import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from './base-error';

export class ExperimentDtoNotFoundException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly dtoType: string) {
    super();
  }
}
