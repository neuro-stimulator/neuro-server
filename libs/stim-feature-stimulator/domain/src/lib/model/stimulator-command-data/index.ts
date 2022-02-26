import { StimulatorIoChangeData } from './stimulator-io-change.data';
import { StimulatorMemoryData } from './stimulator-memory.data';
import { StimulatorNextSequencePartData } from './stimulator-next-sequence-part.data';
import { StimulatorRequestFinishData } from './stimulator-request-finish.data';
import { StimulatorStateData } from './stimulator-state.data';

export type StimulatorData = StimulatorIoChangeData | StimulatorRequestFinishData | StimulatorNextSequencePartData | StimulatorStateData | StimulatorMemoryData;
