import { Injectable } from '@nestjs/common';

import { Sequence } from '@stechy1/diplomka-share';

import { SequenceProtocol } from './sequence/sequence.protocol';

@Injectable()
export class SequenceProtocolCodec {

  public encodeSequence(sequence: Sequence, offset: number, index: number, commandID: number): Buffer {
    return this.sequenceProtocolForType(sequence).encodeSequence(offset, index, commandID);
  }

  protected sequenceProtocolForType(sequence?: Sequence): SequenceProtocol {
    return new SequenceProtocol(sequence);
  }

}
