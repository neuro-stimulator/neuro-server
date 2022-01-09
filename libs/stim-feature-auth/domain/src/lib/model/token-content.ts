import { AclPartial } from '@stechy1/diplomka-share';

export interface TokenContent {
  userId: number;
  uuid: string;
  clientId: string;
  ipAddress: string;
  userGroups: string;
  acl: AclPartial[];
}
