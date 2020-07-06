import { Experiment, ExperimentResult, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class AnotherExperimentResultIsInitializedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR;

  constructor(public readonly initializedExperimentResult: ExperimentResult, public readonly forExperiment: Experiment) {
    super();
  }
}
