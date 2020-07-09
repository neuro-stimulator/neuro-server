import { StimulatorIoChangeData } from './stimulator-io-change.data';
import { StimulatorNextSequencePartData } from './stimulator-next-sequence-part.data';
import { StimulatorStateData } from './stimulator-state.data';
import { StimulatorMemoryData } from './stimulator-memory.data';

export type StimulatorData =
  | StimulatorIoChangeData
  | StimulatorNextSequencePartData
  | StimulatorStateData
  | StimulatorMemoryData;
