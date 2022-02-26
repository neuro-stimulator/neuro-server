import { GetAclByRoleHandler } from './handlers/get-acl-by-role.handler';
import { GetAllAclHandler } from './handlers/get-all-acl.handler';
import { GetDefaultRolesHandler } from './handlers/get-default-roles.handler';

export const HANDLERS = [
  GetAclByRoleHandler,
  GetDefaultRolesHandler,
  GetAllAclHandler
];
