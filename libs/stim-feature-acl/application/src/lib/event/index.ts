import { AclApplicationReadyHandler } from './handlers/acl-application-ready.handler';
import { AclSeedRepositoryHandler } from './handlers/acl-seed-repository.handler';

export const EVENTS = [
  AclSeedRepositoryHandler,
  AclApplicationReadyHandler
];
