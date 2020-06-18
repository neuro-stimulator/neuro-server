import { Sequence } from '@stechy1/diplomka-share';

export class SequenceNotValidException extends Error {
  constructor(public readonly sequence: Sequence) {
    super();
  }
}
