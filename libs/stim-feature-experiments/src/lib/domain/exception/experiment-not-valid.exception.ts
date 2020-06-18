import { Experiment } from '@stechy1/diplomka-share';

export class ExperimentNotValidException extends Error {
  constructor(public readonly experiment: Experiment) {
    super();
  }
}
