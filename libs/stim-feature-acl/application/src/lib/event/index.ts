import { AclSeedRepositoryHandler } from './handlers/acl-seed-repository.handler';
import { AclApplicationReadyHandler } from './handlers/acl-application-ready.handler';

export const EVENTS = [
  AclSeedRepositoryHandler,
  AclApplicationReadyHandler
];
