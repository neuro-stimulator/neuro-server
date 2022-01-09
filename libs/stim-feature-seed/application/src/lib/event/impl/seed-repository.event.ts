import { Type } from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';

export class SeedRepositoryEvent implements IEvent {
  public constructor(public readonly entity: Type<unknown>, public readonly entities: unknown[]) {}
}
