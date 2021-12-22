import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class AclNotDeletedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_ACL_NOT_DELETED;

  constructor(public readonly aclID: number, public readonly error?: QueryError) {
    super();
  }
}
