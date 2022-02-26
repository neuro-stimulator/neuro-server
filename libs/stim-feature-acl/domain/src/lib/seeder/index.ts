import { AclActionSeeder } from './acl-action.seeder';
import { AclPossessionSeeder } from './acl-possession.seeder';
import { AclResourceSeeder } from './acl-resource.seeder';
import { AclRoleSeeder } from './acl-role.seeder';
import { AclSeeder } from './acl.seeder';

export const SEEDERS = [
  AclSeeder,
  AclActionSeeder,
  AclResourceSeeder,
  AclRoleSeeder,
  AclPossessionSeeder
]
