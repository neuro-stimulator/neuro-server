import { QueryError } from '../model/query-error';

export class ExperimentResultWasNotDeletedError extends Error {
  constructor(
    public readonly experimentResultID: number,
    public readonly error?: QueryError
  ) {
    super();
  }
}
