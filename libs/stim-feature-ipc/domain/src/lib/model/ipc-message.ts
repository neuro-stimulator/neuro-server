import { BaseBlockingEvent } from '@neuro-server/stim-lib-common';

export interface IpcMessage<T> extends BaseBlockingEvent<T> {
  readonly topic: string;
}
