import { StimulatorIoChangeData } from './stimulator-io-change.data';
import { StimulatorNextSequencePartData } from './stimulator-next-sequence-part.data';
import { StimulatorStateData } from './stimulator-state.data';
import { StimulatorMemoryData } from './stimulator-memory.data';
import { StimulatorRequestFinishData } from './stimulator-request-finish.data';

export type StimulatorData = StimulatorIoChangeData | StimulatorRequestFinishData | StimulatorNextSequencePartData | StimulatorStateData | StimulatorMemoryData;
