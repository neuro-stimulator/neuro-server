import { IEvent } from '@nestjs/cqrs';

export interface BaseBlockingEvent<DType> extends IEvent {
  readonly commandID: number;
  readonly data: DType;
}
