import { GetAclByRoleHandler } from './handlers/get-acl-by-role.handler';
import { GetDefaultRolesHandler } from './handlers/get-default-roles.handler';
import { GetAllAclHandler } from './handlers/get-all-acl.handler';

export const HANDLERS = [
  GetAclByRoleHandler,
  GetDefaultRolesHandler,
  GetAllAclHandler
];
