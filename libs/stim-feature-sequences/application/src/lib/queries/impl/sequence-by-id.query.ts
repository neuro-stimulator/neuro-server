import { IQuery } from '@nestjs/cqrs';

export class SequenceByIdQuery implements IQuery {
  constructor(public readonly sequenceID: number) {}
}
