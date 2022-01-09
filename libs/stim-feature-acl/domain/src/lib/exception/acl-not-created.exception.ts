import { BaseError, QueryError } from '@neuro-server/stim-lib-common';

import { Acl, MessageCodes } from '@stechy1/diplomka-share';

export class AclNotCreatedException extends BaseError {

  public readonly errorCode = MessageCodes.CODE_ERROR_ACL_NOT_CREATED;

  constructor(public readonly acl: Acl, public readonly error?: QueryError) {
    super();
  }

}
