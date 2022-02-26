import { SequenceWasCreatedHandler } from './handlers/sequence-was-created.handler';
import { SequenceWasGeneratedHandler } from './handlers/sequence-was-generated.handler';
import { SequenceWasUpdatedHandler } from './handlers/sequence-was-updated.handler';
import { SequenceWasDeletedHandler } from './handlers/sequence-was.deleted.handler';

export const EventHandlers = [SequenceWasCreatedHandler, SequenceWasUpdatedHandler, SequenceWasDeletedHandler, SequenceWasGeneratedHandler];
