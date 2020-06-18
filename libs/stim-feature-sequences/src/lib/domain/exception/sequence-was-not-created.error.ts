import { Sequence } from '@stechy1/diplomka-share';

import { QueryError } from '../model/query-error';

export class SequenceWasNotCreatedError extends Error {
  constructor(
    public readonly sequence: Sequence,
    public readonly error?: QueryError
  ) {
    super();
  }
}
