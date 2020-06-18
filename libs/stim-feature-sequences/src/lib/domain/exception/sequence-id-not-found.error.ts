import { QueryError } from '../model/query-error';

export class SequenceIdNotFoundError extends Error {
  constructor(
    public readonly sequenceID: string | number,
    public readonly error?: QueryError
  ) {
    super();
  }
}
