import { QueryError } from '../model/query-error';

export class ExperimentIdNotFoundError extends Error {
  constructor(
    public readonly experimentID: string | number,
    public readonly error?: QueryError
  ) {
    super();
  }
}
