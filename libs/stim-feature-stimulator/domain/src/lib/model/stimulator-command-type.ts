import { StimulatorActionType } from './stimulator-action-type';

export type StimulatorCommandType = StimulatorActionType | 'state' | 'sequence-part' | 'set-output';
