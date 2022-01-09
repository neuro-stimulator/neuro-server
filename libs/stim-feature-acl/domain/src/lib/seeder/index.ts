import { AclSeeder } from './acl.seeder';
import { AclActionSeeder } from './acl-action.seeder';
import { AclResourceSeeder } from './acl-resource.seeder';
import { AclRoleSeeder } from './acl-role.seeder';
import { AclPossessionSeeder } from './acl-possession.seeder';

export const SEEDERS = [
  AclSeeder,
  AclActionSeeder,
  AclResourceSeeder,
  AclRoleSeeder,
  AclPossessionSeeder
]
