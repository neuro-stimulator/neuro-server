import { Sequence } from '@stechy1/diplomka-share';

import { FindOptions } from '@diplomka-backend/stim-lib-common';

export interface SequenceFindOptions {
  userGroups: number[];
  optionalOptions?: SequenceOptionalFindOptions;
}

export interface SequenceOptionalFindOptions extends Partial<Pick<Sequence, 'id' | 'name' | 'experimentId' >>, FindOptions {
  userId?: number
}
