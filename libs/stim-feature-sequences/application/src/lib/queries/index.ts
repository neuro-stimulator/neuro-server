import { SequencesAllHandler } from './handlers/sequences-all.handler';
import { SequenceByIdHandler } from './handlers/sequence-by-id.handler';
import { SequenceNameExistsHandler } from './handlers/sequence-name-exists.handler';
import { SequencesForExperimentHandler } from './handlers/sequences-for-experiment.handler';
import { SequenceValidateHandler } from '../commands/handlers/sequence-validate.handler';

export const QueryHandlers = [SequencesAllHandler, SequenceByIdHandler, SequenceNameExistsHandler, SequencesForExperimentHandler, SequenceValidateHandler];
