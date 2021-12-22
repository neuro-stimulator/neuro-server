import { BaseError } from '@neuro-server/stim-lib-common';
import { AccessControlError } from 'accesscontrol';

import { MessageCodes } from '@stechy1/diplomka-share';

export class PermissionDeniedException extends BaseError {

  public readonly errorCode = MessageCodes.CODE_ERROR_AUTH_PERMISSION_DENIED

  constructor(public readonly originalError: AccessControlError) {
    super();
  }
}
