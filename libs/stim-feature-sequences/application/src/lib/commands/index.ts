import { SequenceDeleteHandler } from './handlers/sequence-delete.handler';
import { SequenceFromExperimentHandler } from './handlers/sequence-from-experiment.handler';
import { SequenceGenerateHandler } from './handlers/sequence-generate.handler';
import { SequenceInsertHandler } from './handlers/sequence-insert.handler';
import { SequenceUpdateHandler } from './handlers/sequence-update.handler';
import { SequenceValidateHandler } from './handlers/sequence-validate.handler';

export const CommandHandlers = [
  SequenceInsertHandler,
  SequenceUpdateHandler,
  SequenceDeleteHandler,
  SequenceGenerateHandler,
  SequenceValidateHandler,
  SequenceFromExperimentHandler,
];
