import { IQuery } from '@nestjs/cqrs';

export class SequenceByIdQuery implements IQuery {
  constructor(public readonly userGroups: number[], public readonly sequenceID: number) {}
}
