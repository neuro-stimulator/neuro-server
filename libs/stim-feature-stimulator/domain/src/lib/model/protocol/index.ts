import { ExperimentProtocolCodec } from './experiment.protocol.codec';
import { FakeProtocol } from './fake/fake.protocol';
import { SequenceProtocolCodec } from './sequence.protocol.codec';
import { StimulatorProtocol } from './stimulator.protocol';

export const PROTOCOL_PROVIDERS = [
  StimulatorProtocol,
  ExperimentProtocolCodec,
  SequenceProtocolCodec,
  FakeProtocol
];
