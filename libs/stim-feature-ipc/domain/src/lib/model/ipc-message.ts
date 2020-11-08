import { BaseBlockingEvent } from '@diplomka-backend/stim-lib-common';

export interface IpcMessage<T> extends BaseBlockingEvent<T> {
  readonly topic: string;
}
