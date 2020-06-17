import { ExperimentResult } from '@stechy1/diplomka-share';
import { QueryError } from '../model/query-error';

export class ExperimentResultWasNotUpdatedError extends Error {
  constructor(
    public readonly experimentResult: ExperimentResult,
    public readonly error?: QueryError
  ) {
    super();
  }
}
