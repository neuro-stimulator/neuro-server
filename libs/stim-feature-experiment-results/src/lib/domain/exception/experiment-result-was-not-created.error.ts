import { ExperimentResult } from '@stechy1/diplomka-share';

import { QueryError } from '../model/query-error';

export class ExperimentResultWasNotCreatedError extends Error {
  constructor(
    public readonly experimentResult: ExperimentResult,
    public readonly error?: QueryError
  ) {
    super();
  }
}
