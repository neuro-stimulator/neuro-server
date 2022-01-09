import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class AclIdNotFoundException extends BaseError {

  public readonly errorCode = MessageCodes.CODE_ERROR_ACL_NOT_FOUND;

  constructor(public readonly id: number) {
    super();
  }
}
