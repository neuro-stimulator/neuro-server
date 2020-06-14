import { Experiment } from '@stechy1/diplomka-share';
import { QueryError } from '../model/query-error';

export class ExperimentWasNotUpdatedError extends Error {
  constructor(
    public readonly experiment: Experiment,
    public readonly error?: QueryError
  ) {
    super();
  }
}
