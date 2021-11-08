import { Experiment, Output } from '@stechy1/diplomka-share';

import { FindOptions } from '@neuro-server/stim-lib-common';

export interface ExperimentFindOptions {
  userGroups: number[];
  optionalOptions?: ExperimentOptionalFindOptions;
}

export interface ExperimentOptionalFindOptions extends Partial<Pick<Experiment<Output>, 'id' | 'name' | 'type' | 'supportSequences'>>, FindOptions {
  userId?: number
}
