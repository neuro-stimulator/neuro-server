import { Acl, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

export class AclNotUpdatedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_ACL_NOT_UPDATED;

  constructor(public readonly acl: Acl, public readonly error?: QueryError) {
    super();
  }
}
