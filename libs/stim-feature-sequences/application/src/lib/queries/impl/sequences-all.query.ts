import { IQuery } from '@nestjs/cqrs';

export class SequencesAllQuery implements IQuery {
  constructor(public readonly userID: number) {}
}
