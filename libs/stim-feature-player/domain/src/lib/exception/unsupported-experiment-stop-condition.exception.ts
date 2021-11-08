import { ExperimentStopConditionType, MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class UnsupportedExperimentStopConditionException extends BaseError {
  public readonly errorCode = MessageCodes.CODE_ERROR_PLAYER_UNSUPPORTED_STOP_CONDITION;

  constructor(public readonly stopConditionType: ExperimentStopConditionType) {
    super();
  }
}
