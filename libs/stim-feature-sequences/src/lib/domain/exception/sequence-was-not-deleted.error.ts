import { QueryError } from '../model/query-error';

export class SequenceWasNotDeletedError extends Error {
  constructor(
    public readonly sequenceID: number,
    public readonly error?: QueryError
  ) {
    super();
  }
}
