import { Experiment, ExperimentResult, MessageCodes, Output } from '@stechy1/diplomka-share';

import { BaseError } from '@diplomka-backend/stim-lib-common';

export class AnotherExperimentResultIsInitializedException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_PLAYER_ANOTHER_EXPERIMENT_RESULT_IS_INITIALIZED;

  constructor(public readonly initializedExperimentResult: ExperimentResult, public readonly forExperiment: Experiment<Output>) {
    super();
  }
}
