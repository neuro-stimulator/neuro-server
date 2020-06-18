import { SequenceWasCreatedHandler } from './handlers/sequence-was-created.handler';
import { SequenceWasUpdatedHandler } from './handlers/sequence-was-updated.handler';
import { SequenceWasDeletedHandler } from './handlers/sequence-was.deleted.handler';
import { SequenceWasGeneratedHandler } from './handlers/sequence-was-generated.handler';

export const EventHandlers = [
  SequenceWasCreatedHandler,
  SequenceWasUpdatedHandler,
  SequenceWasDeletedHandler,
  SequenceWasGeneratedHandler,
];

export * from './handlers/sequence-was-created.handler';
export * from './handlers/sequence-was-updated.handler';
export * from './handlers/sequence-was.deleted.handler';
export * from './handlers/sequence-was-generated.handler';

export * from './impl/sequence-was-created.event';
export * from './impl/sequence-was-updated.event';
export * from './impl/sequence-was-deleted.event';
export * from './impl/sequence-was-generated.event';
