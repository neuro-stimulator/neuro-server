import { ExperimentResult } from '@stechy1/diplomka-share';

export class ExperimentResultNotValidException extends Error {
  constructor(public readonly experimentResult: ExperimentResult) {
    super();
  }
}
