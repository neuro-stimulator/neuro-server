import { User } from '@stechy1/diplomka-share';

import { FindOptions } from '@diplomka-backend/stim-lib-common';

export interface UserFindOptions {
  userGroups?: number[];
  optionalOptions?: UserOptionalFindOptions;
}

export interface UserOptionalFindOptions extends Partial<Pick<User, 'id' | 'email'>>, FindOptions {

}
