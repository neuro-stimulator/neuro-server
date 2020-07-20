import { ExperimentInsertHandler } from './handlers/experiment-insert.handler';
import { ExperimentUpdateHandler } from './handlers/experiment-update.handler';
import { ExperimentDeleteHandler } from './handlers/experiment-delete.handler';
import { ExperimentValidateHandler } from './handlers/experiment-validate.handler';
import { RegisterDtoHandler } from './handlers/register-dto.handler';

export const CommandHandlers = [ExperimentInsertHandler, ExperimentUpdateHandler, ExperimentDeleteHandler, ExperimentValidateHandler, RegisterDtoHandler];
