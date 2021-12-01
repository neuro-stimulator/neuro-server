import { SetMetadata } from '@nestjs/common';

import { Acl } from '@stechy1/diplomka-share';

import { ACL_TOKEN } from '../constants';

export const UseAcl = (...acls: Acl[]) => SetMetadata(ACL_TOKEN, acls);
