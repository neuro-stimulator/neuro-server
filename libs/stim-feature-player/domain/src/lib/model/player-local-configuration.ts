import { PlayerConfiguration } from '@stechy1/diplomka-share';

export interface PlayerLocalConfiguration extends PlayerConfiguration {
  userID: number;
  userGroups: number[];
}
