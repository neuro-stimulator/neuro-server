import { MessageCodes } from '@stechy1/diplomka-share';

import { BaseError } from '@neuro-server/stim-lib-common';

export class ExperimentResultRoundIsNotInitializedException extends BaseError {
    public readonly errorCode = MessageCodes.CODE_ERROR_PLAYER_EXPERIMENT_RESULT_IS_NOT_INITIALIZED;

    constructor(public readonly round: number) {
        super();
    }
}