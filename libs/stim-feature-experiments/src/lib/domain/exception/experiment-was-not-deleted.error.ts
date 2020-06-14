import { QueryError } from '../model/query-error';

export class ExperimentWasNotDeletedError extends Error {
  constructor(
    public readonly experimentID: number,
    public readonly error?: QueryError
  ) {
    super();
  }
}
