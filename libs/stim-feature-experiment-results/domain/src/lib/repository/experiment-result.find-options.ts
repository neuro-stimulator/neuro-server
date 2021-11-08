import { ExperimentResult } from '@stechy1/diplomka-share';

import { FindOptions } from '@neuro-server/stim-lib-common';

export interface ExperimentResultFindOptions {
  userGroups: number[];
  optionalOptions?: ExperimentResultOptionalFindOptions;
}

export interface ExperimentResultOptionalFindOptions extends Partial<Pick<ExperimentResult, 'id' | 'name' | 'type' | 'experimentID'>>, FindOptions {
  userId?: number
}
